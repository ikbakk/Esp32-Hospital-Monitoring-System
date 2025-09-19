#include <globals.h>

void setupTasks() {
  Serial.println("Creating FreeRTOS tasks...");

  // Core 1: Sensor reading task (high priority, real-time)
  xTaskCreatePinnedToCore(sensorTask,           // Function
                          "SensorTask",         // Name
                          4096,                 // Stack size
                          NULL,                 // Parameter
                          SENSOR_TASK_PRIORITY, // Priority
                          &sensorTaskHandle,    // Handle
                          1                     // Core 1
  );

  // Core 0: Network task (lower priority)
  xTaskCreatePinnedToCore(networkTask,           // Function
                          "NetworkTask",         // Name
                          8192,                  // Stack size (larger for HTTP)
                          NULL,                  // Parameter
                          NETWORK_TASK_PRIORITY, // Priority
                          &networkTaskHandle,    // Handle
                          0                      // Core 0
  );

  // Watchdog task (can run on either core)
  xTaskCreate(watchdogTask,           // Function
              "WatchdogTask",         // Name
              2048,                   // Stack size
              NULL,                   // Parameter
              WATCHDOG_TASK_PRIORITY, // Priority
              &watchdogTaskHandle     // Handle
  );

  Serial.println("Tasks created successfully!");
}

void sensorTask(void *parameter) {
  TickType_t xLastWakeTime = xTaskGetTickCount();
  const TickType_t xFrequency = pdMS_TO_TICKS(READING_INTERVAL_MS);

  Serial.println("Sensor task started on Core 1");

  while (true) {
    vTaskDelayUntil(&xLastWakeTime, xFrequency);

    // Take sensor reading
    SensorReading reading = takeSensorReading();

    if (reading.isValid) {
      // Try to send to queue
      if (xQueueSend(sensorQueue, &reading, pdMS_TO_TICKS(100)) != pdTRUE) {
        Serial.println("WARNING: Sensor queue full, dropping reading");
      }

      // Print reading to serial
      Serial.printf("Reading: HR=%.1f, SpO2=%.1f, Temp=%.2f°C\n",
                    reading.heartRate, reading.spo2, reading.bodyTemp);
    } else {
      Serial.println("WARNING: Invalid sensor reading");
    }

    lastSensorReading = millis();
  }
}

void networkTask(void *parameter) {
  TickType_t xLastWakeTime = xTaskGetTickCount();
  const TickType_t xFrequency = pdMS_TO_TICKS(UPLOAD_INTERVAL_MS);

  SensorReading readings[10];
  int readingCount = 0;

  Serial.println("Network task started on Core 0 \n");

  while (true) {
    vTaskDelayUntil(&xLastWakeTime, xFrequency);

    // Check WiFi connection
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi disconnected, attempting reconnection...");
      setupWiFi();
      continue;
    }

    // Collect readings from queue
    readingCount = 0;
    while (readingCount < 10 &&
           xQueueReceive(sensorQueue, &readings[readingCount], 0) == pdTRUE) {
      readingCount++;
    }

    // Upload if we have data
    if (readingCount > 0) {
      Serial.printf("Uploading %d readings to Supabase...\n", readingCount);

      if (uploadToSupabase(readings, readingCount)) {
        Serial.println("Upload successful!");
        lastUpload = millis();
      } else {
        Serial.println("Upload failed, keeping data in queue");
        // Put readings back in queue
        for (int i = readingCount - 1; i >= 0; i--) {
          xQueueSendToFront(sensorQueue, &readings[i], 0);
        }
      }
    }
  }
}

void watchdogTask(void *parameter) {
  Serial.println("Watchdog task started");

  while (true) {
    vTaskDelay(pdMS_TO_TICKS(30000)); // Check every 30 seconds

    // Check if sensor task is running
    if (millis() - lastSensorReading > 10000) {
      Serial.println("ERROR: Sensor task appears stuck!");
    }

    // Check if network task is running
    if (wifiConnected && millis() - lastUpload > 120000) { // 2 minutes
      Serial.println("WARNING: No uploads in 2 minutes");
    }

    // Check memory
    if (ESP.getFreeHeap() < 10000) {
      Serial.println("WARNING: Low memory!");
    }

    // Check queue size
    int queueItems = uxQueueMessagesWaiting(sensorQueue);
    if (queueItems > MAX_QUEUE_SIZE * 0.8) {
      Serial.printf("WARNING: Queue nearly full (%d items)\n", queueItems);
    }
  }
}

bool uploadToSupabase(const SensorReading *readings, int count) {
  Serial.println("Uploading to Supabase..." + String(SUPABASE_URL));
  Serial.println("Uploading to Supabase..." + String(SUPABASE_ANON_KEY));

  if (!wifiConnected) {
    Serial.println("Upload failed: WiFi not connected");
    return false;
  }

  HTTPClient http;
  http.begin(String(SUPABASE_URL) + "/rest/v1/readings");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", String(SUPABASE_ANON_KEY));
  http.addHeader("Authorization", "Bearer " + String(SUPABASE_ANON_KEY));
  http.addHeader("Prefer", "return=minimal");

  DynamicJsonDocument doc(4096);
  JsonArray array = doc.to<JsonArray>();

  for (int i = 0; i < count; i++) {
    JsonObject reading = array.createNestedObject();
    reading["patient_id"] = PATIENT_ID;
    reading["heart_rate"] = readings[i].heartRate;
    reading["spo2"] = readings[i].spo2;
    reading["body_temp"] = readings[i].bodyTemp;
    reading["timestamp"] = getISOTimestamp();
    reading["device_id"] = WiFi.macAddress();
  }

  String jsonString;
  serializeJson(doc, jsonString);

  int httpResponseCode = http.POST(jsonString);

  // Print HTTP response code and body for debugging
  Serial.printf("HTTP Response Code: %d\n", httpResponseCode);
  if (httpResponseCode != 200 && httpResponseCode != 201) {
    String payload = http.getString();
    Serial.println("Upload failed! Response body:");
    Serial.println(payload);
  }

  http.end();

  return (httpResponseCode >= 200 && httpResponseCode < 300);
}

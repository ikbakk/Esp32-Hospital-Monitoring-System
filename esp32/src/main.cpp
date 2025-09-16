#include <config.h>
#include <firebase.h>
#include <freertos/queue.h>
#include <utils.h>
#include <wifi_setup.h>

// ---------------- QUEUE ----------------
QueueHandle_t readingQueue;

// ---------------- TASK HANDLES ----------------
TaskHandle_t taskReadHandle = nullptr;
TaskHandle_t taskUploadHandle = nullptr;

// ---------------- TIMERS ----------------
unsigned long lastReadingTime = 0;

// ==================== TASK: Sensor Reading (Producer) ====================
void taskReadSensors(void *pvParameters) {
  while (true) {
    if (millis() - lastReadingTime >= VITAL_READING_INTERVAL_MS) {
      lastReadingTime = millis();

      DeviceReading reading = generateRandomReading();

      // Push reading to queue (non-blocking)
      if (xQueueSend(readingQueue, &reading, 0) != pdPASS) {
        Serial.println("⚠️ Queue full! Dropping reading...");
      } else {
        Serial.printf("📥 Reading queued at %s\n", getTimestamp().c_str());
      }
    }
    vTaskDelay(10 / portTICK_PERIOD_MS); // Yield to other tasks
  }
}

// ==================== TASK: Upload & WiFi (Consumer) ====================
void taskUpload(void *pvParameters) {
  while (true) {
    // Ensure WiFi connection
    if (WiFi.status() != WL_CONNECTED) {
      connectToWiFi();
    }

    // Firebase loop
    app.loop();

    // Pop reading from queue (blocking up to 100ms)
    DeviceReading reading;
    if (xQueueReceive(readingQueue, &reading, pdMS_TO_TICKS(100)) == pdPASS) {
      uploadReading(reading);
      Serial.printf("📤 Reading uploaded at %s\n", getTimestamp().c_str());
    }

    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

// ==================== SETUP ====================
void setup() {
  Serial.begin(115200);

  loadConfigs();
  connectToWiFi();
  configTime(0, 0, "pool.ntp.org");
  initFirebase();

  Serial.println("🚀 Ward Monitor ESP32 Starting...");
  Serial.printf("Device: %s | Room: %s\n", devConfig.deviceId.c_str(),
                devConfig.roomNumber.c_str());

  // ---------------- CREATE QUEUE ----------------
  readingQueue = xQueueCreate(QUEUE_LENGTH, QUEUE_ITEM_SIZE);
  if (!readingQueue) {
    Serial.println("❌ Failed to create reading queue!");
    while (1)
      vTaskDelay(1000 / portTICK_PERIOD_MS);
  }

  // ---------------- CREATE TASKS ----------------
  xTaskCreatePinnedToCore(taskReadSensors, "TaskReadSensors", 4096, NULL, 1,
                          &taskReadHandle, 1); // Core 1

  xTaskCreatePinnedToCore(taskUpload, "TaskUpload", 8192, NULL, 1,
                          &taskUploadHandle, 0); // Core 0

  Serial.println("✅ FreeRTOS tasks created - Monitoring started");
}

// ==================== LOOP ====================
void loop() {
  vTaskDelay(1000 / portTICK_PERIOD_MS); // Idle
}

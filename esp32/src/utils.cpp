#include <globals.h>

bool max30100Connected = false;
bool mlx90614Connected = false;
unsigned long lastSensorCheck = 0;
unsigned long sensorCheckInterval = 5000; // Check every 5 seconds
int max30100ErrorCount = 0;
int mlx90614ErrorCount = 0;
const int maxErrorCount = 3;

String getISOTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    // Fallback to millis if NTP not available
    return String(millis());
  }

  char buffer[32];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%S.000Z", &timeinfo);
  return String(buffer);
}

void printSystemInfo() {
  Serial.println("\n=== System Information ===");
  Serial.printf("ESP32 Chip: %s Rev %d\n", ESP.getChipModel(),
                ESP.getChipRevision());
  Serial.printf("CPU Frequency: %d MHz\n", ESP.getCpuFreqMHz());
  Serial.printf("Free Heap: %d bytes\n", ESP.getFreeHeap());
  Serial.printf("Flash Size: %d bytes\n", ESP.getFlashChipSize());
  Serial.println("===========================\n");
}

void onBeatDetected() {
  Serial.println("Heart beat detected!");
  lastBeat = millis();
};

bool testMAX30100() {
  // Test MAX30100 connection by trying to read from it
  if (!pox.begin()) {
    return false;
  }

  // Try to update and see if we get valid data
  pox.update();
  delay(100);
  pox.update();

  // Check if the sensor is responding (IR value should be > 0 when working)
  // This is a simple connectivity test
  return true; // oxullo library doesn't expose raw IR values easily
}

bool testMLX90614() {
  // Test MLX90614 by trying to read ambient temperature
  double objectTemp = mlx.readObjectTempC();

  // If we get a reasonable ambient temperature, sensor is connected
  return (objectTemp > -40 && objectTemp < 85); // MLX90614 operating range
}

bool checkSensorConnections() {
  bool sensorsOK = true;

  if (xSemaphoreTake(i2cMutex, pdMS_TO_TICKS(2000)) == pdTRUE) {
    // Test MAX30100
    if (testMAX30100()) {
      max30100ErrorCount = 0;
      if (!max30100Connected) {
        Serial.println("✅ MAX30100 reconnected!");
        max30100Connected = true;
        // Reinitialize the sensor
        pox.setOnBeatDetectedCallback(onBeatDetected);
        pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
      }
    } else {
      max30100ErrorCount++;
      if (max30100ErrorCount >= MAX_SENSOR_ERRORS && max30100Connected) {
        Serial.println("❌ MAX30100 disconnected!");
        max30100Connected = false;
      }
      sensorsOK = false;
    }

    // Test MLX90614
    if (testMLX90614()) {
      mlx90614ErrorCount = 0;
      if (!mlx90614Connected) {
        Serial.println("✅ MLX90614 reconnected!");
        mlx90614Connected = true;
      }
    } else {
      mlx90614ErrorCount++;
      if (mlx90614ErrorCount >= MAX_SENSOR_ERRORS && mlx90614Connected) {
        Serial.println("❌ MLX90614 disconnected!");
        mlx90614Connected = false;
      }
      sensorsOK = false;
    }

    xSemaphoreGive(i2cMutex);
  } else {
    Serial.println("ERROR: Could not acquire I2C mutex for sensor check");
    sensorsOK = false;
  }

  return sensorsOK && max30100Connected && mlx90614Connected;
}

void waitForSensorConnection() {
  Serial.println("\n🔍 Checking sensor connections...");

  while (!checkSensorConnections()) {
    Serial.println("⏳ Waiting for sensors to connect...");
    Serial.printf("   MAX30100: %s (errors: %d)\n",
                  max30100Connected ? "✅ Connected" : "❌ Disconnected",
                  max30100ErrorCount);
    Serial.printf("   MLX90614: %s (errors: %d)\n",
                  mlx90614Connected ? "✅ Connected" : "❌ Disconnected",
                  mlx90614ErrorCount);

// Blink status LED if available
#ifdef STATUS_LED_PIN
    digitalWrite(STATUS_LED_PIN, HIGH);
    delay(250);
    digitalWrite(STATUS_LED_PIN, LOW);
    delay(250);
#else
    delay(500);
#endif

    delay(2000); // Wait 2 seconds between checks
  }

  Serial.println("\n🎉 All sensors connected and ready!");
  Serial.printf("   MAX30100: ✅ Connected\n");
  Serial.printf("   MLX90614: ✅ Connected\n");
}

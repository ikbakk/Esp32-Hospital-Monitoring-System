#include <globals.h>

PulseOximeter pox;
Adafruit_MLX90614 mlx;

float currentHeartRate = 0;
float currentSpO2 = 0;
unsigned long lastBeatDetected = 0;
long lastBeat = 0;

void setupSensors() {
  Serial.println("Initializing sensors...");

#ifdef STATUS_LED_PIN
  pinMode(STATUS_LED_PIN, OUTPUT);
  digitalWrite(STATUS_LED_PIN, LOW);
#endif

  Serial.print("Attempting MAX30100 initialization... ");
  if (pox.begin()) {
    Serial.println("SUCCESS");
    pox.setOnBeatDetectedCallback(onBeatDetected);
    pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
    max30100Connected = true;
    max30100ErrorCount = 0;
  } else {
    Serial.println("FAILED");
    max30100Connected = false;
    max30100ErrorCount = MAX_SENSOR_ERRORS;
  }

  Serial.print("Attempting MLX90614 initialization... ");
  if (mlx.begin()) {
    Serial.println("SUCCESS");
    // Test with a reading
    double testTemp = mlx.readAmbientTempC();
    if (testTemp > -40 && testTemp < 85) {
      mlx90614Connected = true;
      mlx90614ErrorCount = 0;
    } else {
      Serial.println("WARNING: MLX90614 responds but gives invalid readings");
      mlx90614Connected = false;
      mlx90614ErrorCount = MAX_SENSOR_ERRORS;
    }
  } else {
    Serial.println("FAILED");
    mlx90614Connected = false;
    mlx90614ErrorCount = MAX_SENSOR_ERRORS;
  }

  waitForSensorConnection();
}

SensorReading takeSensorReading() {
  SensorReading reading;
  reading.isValid = false;
  reading.timestamp = millis();

  if (!max30100Connected && !mlx90614Connected) {
    Serial.println("ERROR: No sensors connected");
    return reading;
  }

  if (xSemaphoreTake(i2cMutex, pdMS_TO_TICKS(1000)) == pdTRUE) {
    if (max30100Connected) {
      try {
        pox.update();
        currentHeartRate = pox.getHeartRate();
        currentSpO2 = pox.getSpO2();

        // Validate readings
        if (currentHeartRate > MIN_HEART_RATE &&
            currentHeartRate < MAX_HEART_RATE && currentSpO2 > MIN_SPO2 &&
            currentSpO2 <= MAX_SPO2) {
          reading.heartRate = currentHeartRate;
          reading.spo2 = currentSpO2;
        } else {
          reading.heartRate = 0;
          reading.spo2 = 0;
        }
      } catch (...) {
        Serial.println("ERROR: Exception reading MAX30100");
        reading.heartRate = 0;
        reading.spo2 = 0;
        max30100ErrorCount++;
      }
    } else {
      reading.heartRate = 0;
      reading.spo2 = 0;
    }

    if (mlx90614Connected) {
      try {
        double temp = mlx.readObjectTempC();
        if (temp > MIN_BODY_TEMP && temp < MAX_BODY_TEMP) {
          reading.bodyTemp = temp;
        } else {
          reading.bodyTemp = 0;
          // If temperature is completely out of range, sensor might be
          // disconnected
          if (temp < -50 || temp > 100) {
            mlx90614ErrorCount++;
          }
        }
      } catch (...) {
        Serial.println("ERROR: Exception reading MLX90614");
        reading.bodyTemp = 0;
        mlx90614ErrorCount++;
      }
    } else {
      reading.bodyTemp = 0;
    }

    // Reading is valid if we have at least one valid measurement
    reading.isValid =
        (reading.bodyTemp > 0) || (reading.heartRate > 0 && reading.spo2 > 0);

    xSemaphoreGive(i2cMutex);

    if (reading.isValid) {
      Serial.printf(
          "Sensor readings - HR: %.1f BPM, SpO2: %.1f%%, Temp: %.2f°C\n",
          reading.heartRate, reading.spo2, reading.bodyTemp);
    } else {
      Serial.printf("Invalid readings - HR: %.1f, SpO2: %.1f, Temp: %.2f "
                    "(MAX30100: %s, MLX90614: %s)\n",
                    reading.heartRate, reading.spo2, reading.bodyTemp,
                    max30100Connected ? "OK" : "DISCONNECTED",
                    mlx90614Connected ? "OK" : "DISCONNECTED");
    }
  } else {
    Serial.println("ERROR: Failed to acquire I2C mutex");
  }

  return reading;
}

#include <globals.h>

// MAX30105 particleSensor;
// Adafruit_MLX90614 mlx;

const byte RATE_SIZE = 4;
long rateArray[RATE_SIZE];
long lastBeat = 0;
int rateIndex = 0;
long total = 0;
int beatsPerMinute = 0;

void setupSensors() {
  Serial.println("Initializing sensors...");

  // // Initialize MAX30100
  // if (!particleSensor.begin()) {
  //   Serial.println("ERROR: MAX30100 not found!");
  // } else {
  //   Serial.println("MAX30100 initialized successfully");
  //   particleSensor.setup();
  //   particleSensor.setPulseAmplitudeRed(0x0A);
  //   particleSensor.setPulseAmplitudeGreen(0);
  // }

  // // Initialize MLX90614
  // if (!mlx.begin()) {
  //   Serial.println("ERROR: MLX90614 not found!");
  // } else {
  //   Serial.println("MLX90614 initialized successfully");
  // }

  // Initialize heart rate array
  for (int i = 0; i < RATE_SIZE; i++) {
    rateArray[i] = 0;
  }
}

SensorReading takeSensorReading() {
  SensorReading reading;
  reading.isValid = false;
  reading.timestamp = millis();

  if (xSemaphoreTake(i2cMutex, pdMS_TO_TICKS(1000)) == pdTRUE) {
    // Read MAX30100 (Heart Rate & SpO2)
    // long irValue = particleSensor.getIR();

    if (xSemaphoreTake(i2cMutex, pdMS_TO_TICKS(1000)) == pdTRUE) {

      // === Mock Heart Rate & SpO2 ===
      bool beatDetected = random(0, 2); // 50% chance to "detect a beat"
      if (beatDetected) {
        reading.heartRate = random(60, 100);        // 60–100 BPM
        reading.spo2 = 96.0 + random(0, 40) / 10.0; // 96.0–100.0%
      } else {
        reading.heartRate = 0;
        reading.spo2 = 0;
      }

      // === Mock Body Temperature (MLX90614) ===
      double temp = random(360, 375) / 10.0; // 36.0–37.5°C
      if (temp > 30 && temp < 45) {
        reading.bodyTemp = temp;
        reading.isValid = true;
      } else {
        reading.bodyTemp = 0;
      }

      // Release the mutex
      xSemaphoreGive(i2cMutex);
    }

    // Read MLX90614 (Body Temperature)
    double temp = random(360, 375) / 10.0; // 36.0–37.5°C
    if (temp > 30 && temp < 45) {
      reading.bodyTemp = temp;
      reading.isValid = true;
    } else {
      reading.bodyTemp = 0;
    }

    xSemaphoreGive(i2cMutex);
  } else {
    Serial.println("ERROR: Failed to acquire I2C mutex");
  }

  return reading;
}

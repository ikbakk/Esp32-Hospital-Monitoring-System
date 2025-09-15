#include <config.h>
#include <time.h>
#include <vitals.h>

// Global variables
static int reading_sequence = 0;
static float lastHR = -1, lastSpO2 = -1, lastTemp = -1;

String getCurrentTimestamp() {
  time_t now;
  struct tm timeinfo;
  time(&now);
  if (!getLocalTime(&timeinfo)) {
    now = millis() / 1000 + 1725024000;
    timeinfo = *gmtime(&now);
  }
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}

DeviceReading generateRandomReading(const String &patientId) {
  DeviceReading reading;

  reading.id = String(random(100000, 999999));
  reading.timestamp = String(getCurrentTimestamp()); // or use RTC/ISO8601
  reading.vitalSigns.heartRate = random(60, 100);
  reading.vitalSigns.spo2 = random(94, 100);
  reading.vitalSigns.bodyTemp = random(360, 375) / 10.0;

  return reading;
}

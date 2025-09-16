#include <config.h>
#include <time.h>
#include <types.h>

String getTimestamp() {
  time_t now;
  struct tm timeinfo;
  time(&now);

  if (!getLocalTime(&timeinfo)) {
    // Fallback if NTP not synced
    now = millis() / 1000 + 1725024000; // Approximate epoch
    timeinfo = *gmtime(&now);
  }

  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}

DeviceReading generateRandomReading() {
  DeviceReading reading;
  // Generate realistic vital signs
  reading.vitalSigns.heartRate = random(60, 100);
  reading.vitalSigns.spo2 = random(95, 100);
  reading.vitalSigns.bodyTemp = random(360, 375) / 10.0; // 36.0-37.5°C

  return reading;
}

#include <config.h>
#include <firebase.h>
#include <utils.h>
#include <wifi_setup.h>

// ==================== GLOBALS ====================
const String deviceId = DEVICE_ID;
unsigned long lastReadingTime = 0;

// ==================== SETUP ====================
void setup() {
  Serial.begin(115200);

  Serial.println("🚀 Ward Monitor ESP32 Starting...");
  Serial.printf("Device: %s | Room: %s ", deviceId.c_str(), roomNumber.c_str());

  // Connect WiFi
  connectToWiFi();

  // Setup time
  configTime(0, 0, "pool.ntp.org");

  // Initialize Firebase
  initFirebase();

  Serial.println("✅ Setup completed - Starting monitoring...");
}

// ==================== MAIN LOOP ====================
void loop() {
  // Keep Firebase alive
  app.loop();

  // Check WiFi
  checKWiFiConnection();

  // Process any Firebase results
  processFirestoreResults();

  if (app.ready()) {
    // Upload readings at interval
    if (millis() - lastReadingTime >= VITAL_READING_INTERVAL_MS) {
      lastReadingTime = millis();

      if (DEBUG_VITALS) {
        Serial.printf("🕒 Reading cycle at %s\n", getTimestamp().c_str());
      }

      DeviceReading reading = generateRandomReading();
      uploadReading(reading);
    }
  } else {
    // Firebase not ready - log status periodically
    static unsigned long lastStatusLog = 0;
    if (millis() - lastStatusLog >= 10000) { // Every 10 seconds
      lastStatusLog = millis();
      Serial.println("⏳ Waiting for Firebase connection...");
    }
  }

  delay(100); // Small delay for system stability
}

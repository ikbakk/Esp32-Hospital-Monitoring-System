#include "wifi_setup.h"
#include <Arduino.h>
#include <WiFi.h>
#include <config.h>
#include <firebase.h>
#include <types.h>
#include <vitals.h>

const String patientId = DEFAULT_PATIENT_ID;
unsigned long lastReadingTime = 0;
bool patientUploaded = false;

void setup() {
  Serial.begin(115200);
  connectToWiFi();
  initFirebase();
}

void loop() {
  app.loop();
  checKWiFiConnection();
  if (app.ready()) {

    if (millis() - lastReadingTime >= VITAL_READING_INTERVAL_MS) {
      lastReadingTime = millis();
      Serial.printf("🕒 VITAL SIGNS CYCLE - %s\n",
                    getCurrentTimestamp().c_str());
      uploadPatientReadings(generateRandomReading(patientId));
    }

  } else {
    // System not ready - just log status
    static unsigned long lastStatusLog = 0;
    if (millis() - lastStatusLog >= 10000) { // Log every 10 seconds
      lastStatusLog = millis();
      Serial.println("⏳ Waiting for Firebase connection...");
    }
  }

  // Small delay for system stability
  delay(100);
}

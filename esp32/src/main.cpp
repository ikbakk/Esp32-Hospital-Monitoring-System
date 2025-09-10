#include "medical_functions.h"
#include "wifi_setup.h"
#include <Arduino.h>
#include <WiFi.h>
#include <config.h>
#include <firebase.h>
#include <types.h>
#include <vitals.h>

// Device configuration
const String deviceId = DEVICE_ID;
const String patientId = DEFAULT_PATIENT_ID;
const String roomNumber = DEFAULT_ROOM_NUMBER;
const String bedNumber = DEFAULT_BED_NUMBER;

// Timing variables
unsigned long lastReadingTime = 0;
unsigned long lastPatientUpdate = 0;
unsigned long lastDeviceUpdate = 0;
unsigned long lastRoomUpdate = 0;

const unsigned long READING_INTERVAL = 30000;         // 30 seconds
const unsigned long PATIENT_UPDATE_INTERVAL = 300000; // 5 minutes
const unsigned long DEVICE_UPDATE_INTERVAL = 60000;   // 1 minute
const unsigned long ROOM_UPDATE_INTERVAL = 120000;    // 2 minutes

// System status
bool initialDataUploaded = false;

void setup() {
  Serial.begin(115200);
  connectToWiFi();
  initFirebase();
  randomSeed(analogRead(0));
  uploadInitialData();
}

void loop() {
  app.loop();
  checKWiFiConnection();
  if (app.ready()) {

    if (millis() - lastReadingTime >= READING_INTERVAL) {
      lastReadingTime = millis();
      Serial.printf("🕒 VITAL SIGNS CYCLE - %s\n",
                    getCurrentTimestamp().c_str());
      uploadPatientWithReading(createSamplePatient(),
                               generateRandomReading(patientId));
    }

    // 1. Generate and upload vital readings every 30 seconds
    // if (millis() - lastReadingTime >= READING_INTERVAL) {
    //   lastReadingTime = millis();
    //   Serial.printf("🕒 VITAL SIGNS CYCLE - %s\n",
    //                 getCurrentTimestamp().c_str());
    //   generateAndUploadVitals();
    // }

    // 2. Update complete patient record every 5 minutes
    if (millis() - lastPatientUpdate >= PATIENT_UPDATE_INTERVAL) {
      lastPatientUpdate = millis();
      Serial.println("📋 PATIENT RECORD UPDATE CYCLE");
      uploadCompletePatientRecord();
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

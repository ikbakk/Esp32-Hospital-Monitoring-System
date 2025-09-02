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
bool systemReady = false;
bool initialDataUploaded = false;

void setup() {
  Serial.begin(115200);
  Serial.println(
      "\n🏥 MEDICAL MONITORING SYSTEM v2.0 - COMPLETE FIRESTORE EDITION");
  Serial.println(
      "================================================================");

  // Connect to WiFi
  connectToWiFi();

  // Initialize Firebase
  initFirebase();

  // Initialize vitals generation
  randomSeed(analogRead(0));

  // Display configuration
  Serial.println("\n📋 SYSTEM CONFIGURATION:");
  Serial.println("========================");
  Serial.println("   Device: " + deviceId);
  Serial.println("   Patient: " + patientId);
  Serial.println("   Location: Room " + roomNumber + ", Bed " + bedNumber);
  Serial.println("   Reading Interval: " + String(READING_INTERVAL / 1000) +
                 "s");
  Serial.println(
      "   Patient Update: " + String(PATIENT_UPDATE_INTERVAL / 1000) + "s");
  Serial.println("   Device Update: " + String(DEVICE_UPDATE_INTERVAL / 1000) +
                 "s");
  Serial.println("   Room Update: " + String(ROOM_UPDATE_INTERVAL / 1000) +
                 "s");
  Serial.println();

  // Upload all initial data to create complete Firestore structure
  uploadInitialData();

  Serial.println("\n🚀 SYSTEM READY FOR CONTINUOUS MONITORING");
  Serial.println("=========================================");
}

void loop() {
  // Process Firebase operations (CRITICAL!)
  app.loop();

  if (app.ready()) {
    if (!systemReady) {
      systemReady = true;
      Serial.println("🟢 System ready - All uploads active!");
    }
  } else {
    if (systemReady) {
      systemReady = false;
      Serial.println("🔴 Firebase disconnected - Uploads paused!");
    }
  }

  // Check WiFi connection
  checKWiFiConnection();

  // Only proceed with uploads if system is ready
  if (systemReady) {

    // 1. Generate and upload vital readings every 30 seconds
    if (millis() - lastReadingTime >= READING_INTERVAL) {
      lastReadingTime = millis();
      Serial.printf("🕒 VITAL SIGNS CYCLE - %s\n",
                    getCurrentTimestamp().c_str());
      generateAndUploadVitals();
    }

    // 2. Update complete patient record every 5 minutes
    if (millis() - lastPatientUpdate >= PATIENT_UPDATE_INTERVAL) {
      lastPatientUpdate = millis();
      Serial.println("📋 PATIENT RECORD UPDATE CYCLE");
      uploadCompletePatientRecord();
    }

    // 3. Update device status every 1 minute
    if (millis() - lastDeviceUpdate >= DEVICE_UPDATE_INTERVAL) {
      lastDeviceUpdate = millis();
      Serial.println("🔧 DEVICE STATUS UPDATE CYCLE");
      uploadCompleteDeviceStatus();
    }

    // 4. Update room status every 2 minutes
    if (millis() - lastRoomUpdate >= ROOM_UPDATE_INTERVAL) {
      lastRoomUpdate = millis();
      Serial.println("🏥 ROOM STATUS UPDATE CYCLE");
      uploadCompleteRoomStatus();
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

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
unsigned long lastStatusUpdate = 0;

const unsigned long READING_INTERVAL = 30000;         // 30 seconds
const unsigned long PATIENT_UPDATE_INTERVAL = 300000; // 5 minutes
const unsigned long STATUS_UPDATE_INTERVAL = 60000;   // 1 minute

// System status
bool systemReady = false;

PatientRecord createSamplePatient() {
  PatientRecord patient;

  patient.id = patientId;
  patient.name = "John Doe";
  patient.age = 45;
  patient.dateOfBirth = "1979-03-15";
  patient.gender = "Male";
  patient.roomNumber = roomNumber;
  patient.bedNumber = bedNumber;
  patient.admissionDate = "2025-08-30T08:00:00Z";
  patient.condition = PatientCondition::NORMAL;

  // Contact info
  patient.contactInfo.phone = "+1234567890";
  patient.contactInfo.email = "john.doe@email.com";
  patient.contactInfo.emergencyContact = "Jane Doe";
  patient.contactInfo.emergencyPhone = "+1234567891";

  // Medical info
  patient.carePlan = "Standard cardiac monitoring";
  patient.attendingPhysician = "Dr. Smith";
  patient.assignedNurse = "Nurse Johnson";
  patient.insurance = "Health Plus";
  patient.bloodType = "O+";
  patient.monitoringStatus = MonitoringStatus::ACTIVE;

  // Assigned devices
  patient.assignedDevices.push_back(deviceId);

  // Timestamps
  String now = getCurrentTimestamp();
  if (patient.createdAt.isEmpty())
    patient.createdAt = now;
  patient.updatedAt = now;

  return patient;
}

Device createSampleDevice() {
  Device device;
  device.id = deviceId;
  device.deviceStatus = DeviceStatus::ACTIVE;
  device.location.roomNumber = roomNumber;
  device.location.bedNumber = bedNumber;
  return device;
}

void uploadAlertData(const DeviceReading &reading, AlertStatus alertLevel) {
  AlertSummary alert;
  alert.patientName = "John Doe";
  alert.roomNumber = roomNumber;
  alert.activeAlerts.heartRate = reading.vitalSigns.heartRate.alert.status;
  alert.activeAlerts.spo2 = reading.vitalSigns.spo2.alert.status;
  alert.activeAlerts.bodyTemp = reading.vitalSigns.bodyTemp.alert.status;

  // Count active alerts
  alert.alertCount = 0;
  if (alert.activeAlerts.heartRate != AlertStatus::NONE)
    alert.alertCount++;
  if (alert.activeAlerts.spo2 != AlertStatus::NONE)
    alert.alertCount++;
  if (alert.activeAlerts.bodyTemp != AlertStatus::NONE)
    alert.alertCount++;

  alert.lastAlertTime = reading.timestamp;
  alert.severity = (alertLevel == AlertStatus::CRITICAL) ? "high" : "medium";

  uploadAlert(alert);
}

void generateAndUploadVitals() {
  Serial.println("📊 Generating vital signs...");

  // Generate enhanced vitals with alert detection
  DeviceReading reading =
      generateEnhancedVitals(deviceId, patientId, roomNumber);

  // Display vital signs
  Serial.printf(
      "   💓 HR: %.0f bpm [%s]\n", reading.vitalSigns.heartRate.value,
      alertStatusToString(reading.vitalSigns.heartRate.alert.status).c_str());
  Serial.printf(
      "   🫁 SpO2: %.1f%% [%s]\n", reading.vitalSigns.spo2.value,
      alertStatusToString(reading.vitalSigns.spo2.alert.status).c_str());
  Serial.printf(
      "   🌡️ Temp: %.1f°C [%s]\n", reading.vitalSigns.bodyTemp.value,
      alertStatusToString(reading.vitalSigns.bodyTemp.alert.status).c_str());

  // Check for alerts and upload alert if needed
  AlertStatus overallAlert = determineOverallAlertStatus(reading.vitalSigns);
  if (overallAlert != AlertStatus::NONE) {
    Serial.printf("🚨 ALERT DETECTED: %s\n",
                  alertStatusToString(overallAlert).c_str());
    uploadAlertData(reading, overallAlert);
  }

  uploadVitalReading(reading, patientId);
}

void updatePatientData() {
  Serial.println("📋 Updating patient record...");
  PatientRecord patient = createSamplePatient();
  patient.updatedAt = getCurrentTimestamp();
  uploadPatientRecord(patient);
}

void updateDeviceAndRoomStatus() {
  Serial.println("🔧 Updating device and room status...");

  // Update device status
  Device device = createSampleDevice();

  // Update room status
  RoomStatus roomStatus;
  roomStatus.roomNumber = roomNumber;
  roomStatus.patientCount = 1;
  roomStatus.deviceCount = 1;
  roomStatus.activeAlerts = 0;  // Would be calculated from recent readings
  roomStatus.totalReadings = 0; // Would be calculated from database

  updateRoomStatus(roomNumber, roomStatus);
}

void uploadInitialData() {
  Serial.println("📤 Uploading initial patient data...");

  // Create sample patient record
  PatientRecord patient = createSamplePatient();
  uploadPatientRecord(patient);

  // Create sample device record
  Device device = createSampleDevice();
  uploadDeviceStatus(device);

  Serial.println("✅ Initial data upload completed");
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n🏥 Medical Monitoring System v2.0");
  Serial.println("===================================");

  // Connect to WiFi
  connectToWiFi();

  // Initialize Firebase
  initFirebase();

  // Initialize vitals generation
  randomSeed(analogRead(0));

  // // Display configuration
  Serial.println("\n📋 Configuration:");
  Serial.println("   Device: " + deviceId);
  Serial.println("   Patient: " + patientId);
  Serial.println("   Location: Room " + roomNumber + ", Bed " + bedNumber);
  Serial.println("   Reading Interval: " + String(READING_INTERVAL / 1000) +
                 "s");
  Serial.println();

  // Upload initial patient data
  uploadInitialData();
}

void loop() {
  app.loop();

  if (app.ready()) {
    if (!systemReady) {
      systemReady = true;
      Serial.println("🚀 System ready!");
    }
  } else {
    if (systemReady) {
      systemReady = false;
      Serial.println("⚠️ Firebase disconnected!");
    }
  } // Process Firebase operations (CRITICAL!)

  // Check WiFi connection
  checKWiFiConnection();

  // Generate and upload vital readings
  if (millis() - lastReadingTime >= READING_INTERVAL) {
    lastReadingTime = millis();
    generateAndUploadVitals();
  }

  // Update patient record periodically
  if (millis() - lastPatientUpdate >= PATIENT_UPDATE_INTERVAL) {
    lastPatientUpdate = millis();
    updatePatientData();
  }

  // Update device status periodically
  if (millis() - lastStatusUpdate >= STATUS_UPDATE_INTERVAL) {
    lastStatusUpdate = millis();
    updateDeviceAndRoomStatus();
  }

  // Small delay for system stability
  delay(100);
}

// include/config.h - Updated configuration for medical monitoring system
#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// ==================== WIFI CONFIGURATION ====================
#define WIFI_SSID "SSID"
#define WIFI_PASSWORD "PASSWORD"
#define WIFI_TIMEOUT_MS 30000

// ==================== FIREBASE CONFIGURATION ====================
#define API_KEY "API"
#define USER_EMAIL "email"
#define USER_PASSWORD "passsword"
#define FIREBASE_PROJECT_ID "firebase-project id"
#define AUTH_EXPIRE_PERIOD 3000 // seconds (<3600)

// ==================== DEVICE CONFIGURATION ====================
#define DEVICE_ID "esp32_monitor_001"
#define DEFAULT_PATIENT_ID "patient_001"
#define DEFAULT_ROOM_NUMBER "101"
#define DEFAULT_BED_NUMBER "A"

// ==================== TIMING CONFIGURATION ====================
#define VITAL_READING_INTERVAL_MS 1000    // 30 seconds
#define PATIENT_UPDATE_INTERVAL_MS 300000 // 5 minutes
#define DEVICE_UPDATE_INTERVAL_MS 60000   // 1 minute
#define ROOM_UPDATE_INTERVAL_MS 120000    // 2 minutes
#define ALERT_CHECK_INTERVAL_MS 5000      // 5 seconds

// ==================== VITAL SIGNS RANGES (Normal) ====================
struct NormalVitalRanges {
  // Heart Rate (BPM)
  float hrMin = 60.0;
  float hrMax = 100.0;

  // SpO2 (%)
  float spo2Min = 95.0;
  float spo2Max = 100.0;

  // Body Temperature (°C)
  float tempMin = 36.1;
  float tempMax = 37.2;

  // Variation factors (how much each reading can change)
  float hrVariation = 0.05;   // 5% of range
  float spo2Variation = 0.03; // 3% of range
  float tempVariation = 0.02; // 2% of range
};

// ==================== ALERT THRESHOLDS ====================
struct AlertThresholds {
  // Heart Rate thresholds
  struct {
    float warningLow = 50.0;
    float warningHigh = 120.0;
    float criticalLow = 40.0;
    float criticalHigh = 150.0;
  } heartRate;

  // SpO2 thresholds
  struct {
    float warningLow = 88.0;
    float criticalLow = 85.0;
  } spo2;

  // Body Temperature thresholds
  struct {
    float warningLow = 35.0;
    float warningHigh = 38.5;
    float criticalLow = 34.0;
    float criticalHigh = 40.0;
  } bodyTemp;
};

// ==================== HOSPITAL CONFIGURATION ====================
struct HospitalConfig {
  String hospitalName = "General Hospital";
  String hospitalId = "GH001";
  String departmentName = "Cardiac Care Unit";
  String departmentId = "CCU";
  String wardName = "Ward A";
  String wardId = "WARD_A";
};

// ==================== DEVICE CAPABILITIES ====================
struct DeviceCapabilities {
  bool hasHeartRateMonitor = true;
  bool hasSpO2Monitor = true;
  bool hasTemperatureMonitor = true;
  bool hasBloodPressureMonitor = false;
  bool hasECGMonitor = false;
  bool hasRespiratoryRateMonitor = false;

  // Update intervals for different monitors (ms)
  unsigned long hrUpdateInterval = 1000;   // 1 second
  unsigned long spo2UpdateInterval = 2000; // 2 seconds
  unsigned long tempUpdateInterval = 5000; // 5 seconds
};

// ==================== PATIENT SIMULATION ====================
struct SimulationSettings {
  // Enable different patient conditions for testing
  bool enableRandomAlerts = true;
  float alertProbability = 0.05; // 5% chance per reading

  // Patient condition scenarios
  bool simulateStablePatient = true;
  bool simulateFeverPatient = false;
  bool simulateTachycardiaPatient = false;
  bool simulateHypoxiaPatient = false;

  // Alert persistence (how many readings alerts last)
  int alertPersistenceReadings = 3;
};

// ==================== DEBUG CONFIGURATION ====================
#define DEBUG_VITALS true
#define DEBUG_FIREBASE false
#define DEBUG_WIFI false
#define DEBUG_ALERTS true
#define DEBUG_PATIENT_RECORDS false

// ==================== FIRESTORE COLLECTIONS ====================
#define COLLECTION_PATIENTS "patients"
#define COLLECTION_DEVICES "devices"
#define COLLECTION_READINGS "readings"
#define COLLECTION_ALERTS "alerts"
#define COLLECTION_ROOMS "rooms"
#define COLLECTION_MEDICAL_HISTORY "medicalHistory"
#define COLLECTION_MEDICATIONS "medications"
#define COLLECTION_ALLERGIES "allergies"

// ==================== SYSTEM STATUS ====================
enum class SystemStatus {
  INITIALIZING,
  WIFI_CONNECTING,
  FIREBASE_CONNECTING,
  OPERATIONAL,
  ERROR_WIFI,
  ERROR_FIREBASE,
  MAINTENANCE_MODE
};

// ==================== GLOBAL DEFAULTS ====================
extern NormalVitalRanges normalRanges;
extern AlertThresholds alertThresholds;
extern HospitalConfig hospitalConfig;
extern DeviceCapabilities deviceCapabilities;
extern SimulationSettings simulationSettings;

#endif // CONFIG_H

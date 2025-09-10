#pragma once
#include <Arduino.h>
#include <types.h>

// Legacy structure for backward compatibility
struct PatientVitals {
  float heartRate;
  float spo2;
  float bodyTemp;
  String timestamp;
  String deviceId;
  int readingSequence;

  // Convert to new DeviceReading structure
  DeviceReading toDeviceReading() const;
};

struct VitalThresholds {
  struct {
    float warningLow = 50.0;
    float warningHigh = 120.0;
    float criticalLow = 40.0;
    float criticalHigh = 150.0;
  } heartRate;

  struct {
    float warningLow = 88.0;
    float criticalLow = 85.0;
  } spo2;

  struct {
    float warningLow = 35.0;
    float warningHigh = 38.5;
    float criticalLow = 34.0;
    float criticalHigh = 40.0;
  } bodyTemp;
};

// Vitals generation and processing
PatientVitals generateVitals(const String &deviceId);
DeviceReading generateEnhancedVitals(const String &deviceId,
                                     const String &patientId,
                                     const String &roomNumber);
String getCurrentTimestamp();
VitalAlert checkVitalAlert(float value, float warningLow, float warningHigh,
                           float criticalLow, float criticalHigh);
AlertStatus determineOverallAlertStatus(const VitalSigns &vitals);
DeviceReading generateRandomReading(const String &patientId);

// Global thresholds (can be configured)
extern VitalThresholds vitalThresholds;

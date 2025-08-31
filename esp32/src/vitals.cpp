#include <config.h>
#include <time.h>
#include <vitals.h>

// Global variables
static int reading_sequence = 0;
static float lastHR = -1, lastSpO2 = -1, lastTemp = -1;
VitalThresholds vitalThresholds; // Use default values from header

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

float generateRealisticValue(float minVal, float maxVal, float prev) {
  if (prev > 0) {
    float variation = (maxVal - minVal) * 0.05;
    float val = prev + random(-variation * 100, variation * 100) / 100.0;
    if (val < minVal)
      val = minVal + (maxVal - minVal) * 0.1;
    if (val > maxVal)
      val = maxVal - (maxVal - minVal) * 0.1;
    return val;
  }
  return minVal + (maxVal - minVal) * random(0, 100) / 100.0;
}

// Check vital sign against thresholds and return alert info
VitalAlert checkVitalAlert(float value, float warningLow, float warningHigh,
                           float criticalLow, float criticalHigh) {
  VitalAlert alert;
  alert.warningCount = 0;
  alert.criticalCount = 0;

  if (value <= criticalLow || value >= criticalHigh) {
    alert.status = AlertStatus::CRITICAL;
    alert.criticalCount = 1;
  } else if (value <= warningLow || value >= warningHigh) {
    alert.status = AlertStatus::WARNING;
    alert.warningCount = 1;
  } else {
    alert.status = AlertStatus::NONE;
  }

  return alert;
}

// Legacy function for backward compatibility
PatientVitals generateVitals(const String &deviceId) {
  PatientVitals v;
  v.heartRate = round(generateRealisticValue(60, 100, lastHR));
  v.spo2 = round(generateRealisticValue(90, 100, lastSpO2) * 10) / 10.0;
  v.bodyTemp = round(generateRealisticValue(36.1, 37.2, lastTemp) * 10) / 10.0;
  v.timestamp = getCurrentTimestamp();
  v.deviceId = deviceId;
  v.readingSequence = ++reading_sequence;

  lastHR = v.heartRate;
  lastSpO2 = v.spo2;
  lastTemp = v.bodyTemp;

  return v;
}

// Enhanced vitals generation with alert detection
DeviceReading generateEnhancedVitals(const String &deviceId,
                                     const String &patientId,
                                     const String &roomNumber) {
  DeviceReading reading;

  // Generate basic vital values
  float hr = round(generateRealisticValue(60, 100, lastHR));
  float spo2 = round(generateRealisticValue(95, 100, lastSpO2) * 10) / 10.0;
  float temp = round(generateRealisticValue(36.1, 37.2, lastTemp) * 10) / 10.0;

  // Create vital signs with alerts
  reading.vitalSigns.heartRate.value = hr;
  reading.vitalSigns.heartRate.alert =
      checkVitalAlert(hr, vitalThresholds.heartRate.warningLow,
                      vitalThresholds.heartRate.warningHigh,
                      vitalThresholds.heartRate.criticalLow,
                      vitalThresholds.heartRate.criticalHigh);

  reading.vitalSigns.spo2.value = spo2;
  reading.vitalSigns.spo2.alert =
      checkVitalAlert(spo2, vitalThresholds.spo2.warningLow, 100.0,
                      vitalThresholds.spo2.criticalLow, 100.0);

  reading.vitalSigns.bodyTemp.value = temp;
  reading.vitalSigns.bodyTemp.alert =
      checkVitalAlert(temp, vitalThresholds.bodyTemp.warningLow,
                      vitalThresholds.bodyTemp.warningHigh,
                      vitalThresholds.bodyTemp.criticalLow,
                      vitalThresholds.bodyTemp.criticalHigh);

  // Set metadata
  reading.id = "reading_" + String(++reading_sequence) + "_" + String(millis());
  reading.timestamp = getCurrentTimestamp();
  reading.deviceId = deviceId;

  // Update last values for continuity
  lastHR = hr;
  lastSpO2 = spo2;
  lastTemp = temp;

  return reading;
}

// Determine overall alert status from vital signs
AlertStatus determineOverallAlertStatus(const VitalSigns &vitals) {
  if (vitals.heartRate.alert.status == AlertStatus::CRITICAL ||
      vitals.spo2.alert.status == AlertStatus::CRITICAL ||
      vitals.bodyTemp.alert.status == AlertStatus::CRITICAL) {
    return AlertStatus::CRITICAL;
  }

  if (vitals.heartRate.alert.status == AlertStatus::WARNING ||
      vitals.spo2.alert.status == AlertStatus::WARNING ||
      vitals.bodyTemp.alert.status == AlertStatus::WARNING) {
    return AlertStatus::WARNING;
  }

  return AlertStatus::NONE;
}

// Convert legacy PatientVitals to new DeviceReading
DeviceReading PatientVitals::toDeviceReading() const {
  DeviceReading reading;

  reading.id = "reading_" + String(readingSequence) + "_" + String(millis());
  reading.timestamp = timestamp;
  reading.deviceId = deviceId;

  // Convert simple values to enhanced structure
  reading.vitalSigns.heartRate.value = heartRate;
  reading.vitalSigns.heartRate.alert =
      checkVitalAlert(heartRate, vitalThresholds.heartRate.warningLow,
                      vitalThresholds.heartRate.warningHigh,
                      vitalThresholds.heartRate.criticalLow,
                      vitalThresholds.heartRate.criticalHigh);

  reading.vitalSigns.spo2.value = spo2;
  reading.vitalSigns.spo2.alert =
      checkVitalAlert(spo2, vitalThresholds.spo2.warningLow, 100.0,
                      vitalThresholds.spo2.criticalLow, 100.0);

  reading.vitalSigns.bodyTemp.value = bodyTemp;
  reading.vitalSigns.bodyTemp.alert =
      checkVitalAlert(bodyTemp, vitalThresholds.bodyTemp.warningLow,
                      vitalThresholds.bodyTemp.warningHigh,
                      vitalThresholds.bodyTemp.criticalLow,
                      vitalThresholds.bodyTemp.criticalHigh);

  return reading;
}

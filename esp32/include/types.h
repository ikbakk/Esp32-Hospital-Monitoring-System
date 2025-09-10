#pragma once
#include <Arduino.h>
#include <vector>

// Alert status enumeration
enum class AlertStatus { NONE, WARNING, CRITICAL };

// Patient condition enumeration
enum class PatientCondition { NORMAL, WARNING, CRITICAL };

// Device status enumeration
enum class DeviceStatus { ACTIVE, INACTIVE, MAINTENANCE };

// Monitoring status enumeration
enum class MonitoringStatus { ACTIVE, PAUSED, DISCONTINUED };

// Medical History structure
struct MedicalHistory {
  String condition;
  String diagnosedDate;
  String status; // "active", "resolved", "chronic"
  String notes;
};

// Medication structure
struct Medication {
  String name;
  String dosage;
  String frequency;
  String prescribedDate;
  String prescribedBy;
  String status; // "active", "discontinued"
};

// Allergy structure
struct Allergy {
  String allergen;
  String severity; // "mild", "moderate", "severe"
  String reaction;
  String discoveredDate;
};

// Contact Information structure
struct ContactInfo {
  String phone;
  String email;
  String emergencyContact;
  String emergencyPhone;
};

// Alert structure for vital signs
struct VitalAlert {
  AlertStatus status;
  int warningCount;
  int criticalCount;
};

// Individual vital sign with alert info
struct VitalSign {
  float value;
  VitalAlert alert;
};

// Complete vital signs structure
struct VitalSigns {
  float heartRate;
  float spo2;
  float bodyTemp;
};

// Device location
struct DeviceLocation {
  String roomNumber;
  String bedNumber;
};

// Device structure
struct Device {
  String id;
  DeviceStatus deviceStatus;
  DeviceLocation location;
};

// Device reading structure
struct DeviceReading {
  String id;
  VitalSigns vitalSigns;
  String timestamp;
  String deviceId;
};

// Alert summary structure
struct AlertSummary {
  String patientName;
  String roomNumber;
  struct {
    AlertStatus heartRate;
    AlertStatus spo2;
    AlertStatus bodyTemp;
  } activeAlerts;
  int alertCount;
  String lastAlertTime;
  String severity; // "low", "medium", "high"
};

// Complete patient record structure
struct PatientRecord {
  String id;
  String name;
  int age;
  String dateOfBirth;
  String gender;
  String roomNumber;
  String bedNumber;
  String admissionDate;
  PatientCondition condition;
  ContactInfo contactInfo;
  std::vector<MedicalHistory> medicalHistory;
  std::vector<Medication> currentMedications;
  std::vector<Allergy> allergies;
  String carePlan;
  String attendingPhysician;
  String assignedNurse;
  String insurance;
  String bloodType;
  std::vector<String> assignedDevices;
  MonitoringStatus monitoringStatus;
  String createdAt;
  String updatedAt;
};

// Room status structure
struct RoomStatus {
  String roomNumber;
  int patientCount;
  int deviceCount;
  int activeAlerts;
  int totalReadings;
  String lastUpdate;
};

// Utility functions for enum conversion
String alertStatusToString(AlertStatus status);
String patientConditionToString(PatientCondition condition);
String deviceStatusToString(DeviceStatus status);
String monitoringStatusToString(MonitoringStatus status);

AlertStatus stringToAlertStatus(const String &str);
PatientCondition stringToPatientCondition(const String &str);
DeviceStatus stringToDeviceStatus(const String &str);
MonitoringStatus stringToMonitoringStatus(const String &str);

#include <types.h>

// Convert AlertStatus enum to string
String alertStatusToString(AlertStatus status) {
  switch (status) {
  case AlertStatus::NONE:
    return "none";
  case AlertStatus::WARNING:
    return "warning";
  case AlertStatus::CRITICAL:
    return "critical";
  default:
    return "none";
  }
}

// Convert PatientCondition enum to string
String patientConditionToString(PatientCondition condition) {
  switch (condition) {
  case PatientCondition::NORMAL:
    return "normal";
  case PatientCondition::WARNING:
    return "warning";
  case PatientCondition::CRITICAL:
    return "critical";
  default:
    return "normal";
  }
}

// Convert DeviceStatus enum to string
String deviceStatusToString(DeviceStatus status) {
  switch (status) {
  case DeviceStatus::ACTIVE:
    return "active";
  case DeviceStatus::INACTIVE:
    return "inactive";
  case DeviceStatus::MAINTENANCE:
    return "maintenance";
  default:
    return "active";
  }
}

// Convert MonitoringStatus enum to string
String monitoringStatusToString(MonitoringStatus status) {
  switch (status) {
  case MonitoringStatus::ACTIVE:
    return "active";
  case MonitoringStatus::PAUSED:
    return "paused";
  case MonitoringStatus::DISCONTINUED:
    return "discontinued";
  default:
    return "active";
  }
}

// Convert string to AlertStatus enum
AlertStatus stringToAlertStatus(const String &str) {
  if (str == "warning")
    return AlertStatus::WARNING;
  if (str == "critical")
    return AlertStatus::CRITICAL;
  return AlertStatus::NONE;
}

// Convert string to PatientCondition enum
PatientCondition stringToPatientCondition(const String &str) {
  if (str == "warning")
    return PatientCondition::WARNING;
  if (str == "critical")
    return PatientCondition::CRITICAL;
  return PatientCondition::NORMAL;
}

// Convert string to DeviceStatus enum
DeviceStatus stringToDeviceStatus(const String &str) {
  if (str == "inactive")
    return DeviceStatus::INACTIVE;
  if (str == "maintenance")
    return DeviceStatus::MAINTENANCE;
  return DeviceStatus::ACTIVE;
}

// Convert string to MonitoringStatus enum
MonitoringStatus stringToMonitoringStatus(const String &str) {
  if (str == "paused")
    return MonitoringStatus::PAUSED;
  if (str == "discontinued")
    return MonitoringStatus::DISCONTINUED;
  return MonitoringStatus::ACTIVE;
}

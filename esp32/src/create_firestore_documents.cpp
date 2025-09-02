#include <config.h>
#include <firebase.h>
#include <types.h>
#include <vitals.h>

Document<Values::Value> createReadingDocument(const DeviceReading &reading,
                                              const String &patientId) {
  Document<Values::Value> doc;

  // Basic info
  doc.add("id", Values::Value(Values::StringValue(reading.id)));
  doc.add("timestamp", Values::Value(Values::StringValue(reading.timestamp)));
  doc.add("deviceId", Values::Value(Values::StringValue(reading.deviceId)));
  doc.add("patientId", Values::Value(Values::StringValue(patientId)));

  // Heart Rate
  Values::MapValue hrMap(
      "value", Values::DoubleValue(reading.vitalSigns.heartRate.value));
  Values::MapValue hrAlert("status",
                           Values::StringValue(alertStatusToString(
                               reading.vitalSigns.heartRate.alert.status)));
  hrAlert.add(
      "warningCount",
      Values::IntegerValue(reading.vitalSigns.heartRate.alert.warningCount));
  hrAlert.add(
      "criticalCount",
      Values::IntegerValue(reading.vitalSigns.heartRate.alert.criticalCount));
  hrMap.add("alert", Values::Value(hrAlert));

  // SpO2
  Values::MapValue spo2Map("value",
                           Values::DoubleValue(reading.vitalSigns.spo2.value));
  Values::MapValue spo2Alert(
      "status", Values::StringValue(
                    alertStatusToString(reading.vitalSigns.spo2.alert.status)));
  spo2Alert.add(
      "warningCount",
      Values::IntegerValue(reading.vitalSigns.spo2.alert.warningCount));
  spo2Alert.add(
      "criticalCount",
      Values::IntegerValue(reading.vitalSigns.spo2.alert.criticalCount));
  spo2Map.add("alert", Values::Value(spo2Alert));

  // Body Temperature
  Values::MapValue tempMap(
      "value", Values::DoubleValue(reading.vitalSigns.bodyTemp.value));
  Values::MapValue tempAlert("status",
                             Values::StringValue(alertStatusToString(
                                 reading.vitalSigns.bodyTemp.alert.status)));
  tempAlert.add(
      "warningCount",
      Values::IntegerValue(reading.vitalSigns.bodyTemp.alert.warningCount));
  tempAlert.add(
      "criticalCount",
      Values::IntegerValue(reading.vitalSigns.bodyTemp.alert.criticalCount));
  tempMap.add("alert", Values::Value(tempAlert));

  // Combine vital signs
  Values::MapValue vitalSigns("heartRate", Values::Value(hrMap));
  vitalSigns.add("spo2", Values::Value(spo2Map));
  vitalSigns.add("bodyTemp", Values::Value(tempMap));
  doc.add("vitalSigns", Values::Value(vitalSigns));

  return doc;
}

Document<Values::Value> createPatientDocument(const PatientRecord &patient) {
  Document<Values::Value> doc;

  // Basic info
  doc.add("id", Values::Value(Values::StringValue(patient.id)));
  doc.add("name", Values::Value(Values::StringValue(patient.name)));
  doc.add("age", Values::Value(Values::IntegerValue(patient.age)));
  doc.add("dateOfBirth",
          Values::Value(Values::StringValue(patient.dateOfBirth)));
  doc.add("gender", Values::Value(Values::StringValue(patient.gender)));
  doc.add("roomNumber", Values::Value(Values::StringValue(patient.roomNumber)));
  doc.add("bedNumber", Values::Value(Values::StringValue(patient.bedNumber)));
  doc.add("admissionDate",
          Values::Value(Values::StringValue(patient.admissionDate)));
  doc.add("condition", Values::Value(Values::StringValue(
                           patientConditionToString(patient.condition))));

  // Contact info
  Values::MapValue contact("phone",
                           Values::StringValue(patient.contactInfo.phone));
  contact.add("email", Values::StringValue(patient.contactInfo.email));
  contact.add("emergencyContact",
              Values::StringValue(patient.contactInfo.emergencyContact));
  contact.add("emergencyPhone",
              Values::StringValue(patient.contactInfo.emergencyPhone));
  doc.add("contactInfo", Values::Value(contact));

  // Medical info
  doc.add("carePlan", Values::Value(Values::StringValue(patient.carePlan)));
  doc.add("attendingPhysician",
          Values::Value(Values::StringValue(patient.attendingPhysician)));
  doc.add("assignedNurse",
          Values::Value(Values::StringValue(patient.assignedNurse)));
  doc.add("insurance", Values::Value(Values::StringValue(patient.insurance)));
  doc.add("bloodType", Values::Value(Values::StringValue(patient.bloodType)));
  doc.add("monitoringStatus",
          Values::Value(Values::StringValue(
              monitoringStatusToString(patient.monitoringStatus))));

  // Assigned devices - simplified approach
  Values::ArrayValue devices(Values::Value(Values::StringValue(
      patient.assignedDevices.empty() ? "none" : patient.assignedDevices[0])));
  for (size_t i = 1; i < patient.assignedDevices.size(); i++) {
    devices.add(Values::Value(Values::StringValue(patient.assignedDevices[i])));
  }
  doc.add("assignedDevices", Values::Value(devices));

  // Timestamps
  doc.add("createdAt", Values::Value(Values::StringValue(patient.createdAt)));
  doc.add("updatedAt", Values::Value(Values::StringValue(patient.updatedAt)));

  return doc;
}

Document<Values::Value> createDeviceDocument(const Device &device) {
  Document<Values::Value> doc;

  doc.add("id", Values::Value(Values::StringValue(device.id)));
  doc.add("deviceStatus", Values::Value(Values::StringValue(
                              deviceStatusToString(device.deviceStatus))));

  // Location
  Values::MapValue location("roomNumber",
                            Values::StringValue(device.location.roomNumber));
  location.add("bedNumber", Values::StringValue(device.location.bedNumber));
  doc.add("location", Values::Value(location));

  doc.add("lastUpdate",
          Values::Value(Values::StringValue(getCurrentTimestamp())));

  return doc;
}

Document<Values::Value> createAlertDocument(const AlertSummary &alert) {
  Document<Values::Value> doc;

  doc.add("patientName", Values::Value(Values::StringValue(alert.patientName)));
  doc.add("roomNumber", Values::Value(Values::StringValue(alert.roomNumber)));
  doc.add("alertCount", Values::Value(Values::IntegerValue(alert.alertCount)));
  doc.add("lastAlertTime",
          Values::Value(Values::StringValue(alert.lastAlertTime)));
  doc.add("severity", Values::Value(Values::StringValue(alert.severity)));

  // Active alerts
  Values::MapValue activeAlerts(
      "heartRate",
      Values::StringValue(alertStatusToString(alert.activeAlerts.heartRate)));
  activeAlerts.add("spo2", Values::StringValue(
                               alertStatusToString(alert.activeAlerts.spo2)));
  activeAlerts.add("bodyTemp", Values::StringValue(alertStatusToString(
                                   alert.activeAlerts.bodyTemp)));
  doc.add("activeAlerts", Values::Value(activeAlerts));

  doc.add("timestamp",
          Values::Value(Values::StringValue(getCurrentTimestamp())));

  return doc;
}

Document<Values::Value> createRoomDocument(const RoomStatus &status) {
  Document<Values::Value> doc;

  doc.add("roomNumber", Values::Value(Values::StringValue(status.roomNumber)));
  doc.add("patientCount",
          Values::Value(Values::IntegerValue(status.patientCount)));
  doc.add("deviceCount",
          Values::Value(Values::IntegerValue(status.deviceCount)));
  doc.add("activeAlerts",
          Values::Value(Values::IntegerValue(status.activeAlerts)));
  doc.add("totalReadings",
          Values::Value(Values::IntegerValue(status.totalReadings)));
  doc.add("lastUpdate",
          Values::Value(Values::StringValue(getCurrentTimestamp())));

  return doc;
}

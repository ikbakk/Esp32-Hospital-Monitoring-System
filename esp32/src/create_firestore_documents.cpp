#include <config.h>
#include <firebase.h>
#include <types.h>
#include <vitals.h>

// Overloads for Document
void addField(Document<Values::Value> &doc, const String &key,
              const String &value) {
  doc.add(key, Values::Value(Values::StringValue(value)));
}

void addField(Document<Values::Value> &doc, const String &key, int value) {
  doc.add(key, Values::Value(Values::IntegerValue(value)));
}

void addField(Document<Values::Value> &doc, const String &key, double value) {
  doc.add(key, Values::Value(Values::DoubleValue(value)));
}

// Overloads for MapValue
void addField(Values::MapValue &map, const String &key, const String &value) {
  map.add(key, Values::Value(Values::StringValue(value)));
}

void addField(Values::MapValue &map, const String &key, int value) {
  map.add(key, Values::Value(Values::IntegerValue(value)));
}

void addField(Values::MapValue &map, const String &key, double value) {
  map.add(key, Values::Value(Values::DoubleValue(value)));
}

Document<Values::Value> createReadingDocument(const DeviceReading &reading,
                                              const String &patientId) {
  Document<Values::Value> doc;

  // Basic info
  addField(doc, "id", reading.id);
  addField(doc, "timestamp", reading.timestamp);

  // Readings
  addField(doc, "heartRate", reading.vitalSigns.heartRate);
  addField(doc, "spo2", reading.vitalSigns.spo2);
  addField(doc, "bodyTemp", reading.vitalSigns.bodyTemp);

  return doc;
}

Document<Values::Value> createPatientDocument(const PatientRecord &patient) {
  Document<Values::Value> doc;

  // Basic info
  addField(doc, "id", patient.id);
  addField(doc, "name", patient.name);
  addField(doc, "age", patient.age);
  addField(doc, "dateOfBirth", patient.dateOfBirth);
  addField(doc, "gender", patient.gender);
  addField(doc, "roomNumber", patient.roomNumber);
  addField(doc, "bedNumber", patient.bedNumber);
  addField(doc, "admissionDate", patient.admissionDate);
  addField(doc, "condition", patientConditionToString(patient.condition));

  // Contact info
  addField(doc, "phone", patient.contactInfo.phone);
  addField(doc, "email", patient.contactInfo.email);
  addField(doc, "emergencyContact", patient.contactInfo.emergencyContact);
  addField(doc, "emergencyPhone", patient.contactInfo.emergencyPhone);

  // Medical info
  addField(doc, "carePlan", patient.carePlan);
  addField(doc, "attendingPhysician", patient.attendingPhysician);
  addField(doc, "assignedNurse", patient.assignedNurse);
  addField(doc, "insurance", patient.insurance);
  addField(doc, "bloodType", patient.bloodType);
  addField(doc, "monitoringStatus",
           monitoringStatusToString(patient.monitoringStatus));

  // Devices
  addField(doc, "primaryDevice",
           patient.assignedDevices.empty() ? "none"
                                           : patient.assignedDevices[0]);

  // Timestamps
  addField(doc, "createdAt", patient.createdAt);
  addField(doc, "updatedAt", patient.updatedAt);

  return doc;
}

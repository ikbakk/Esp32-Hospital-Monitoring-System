#include <config.h>
#include <firebase_setup.h>

WiFiClientSecure ssl_client;
FirebaseApp app;
AsyncResult firestoreResult;
Firestore::Documents Docs;
using AsyncClient = AsyncClientClass;
AsyncClient aClient(ssl_client);

inline void set_ssl_client_insecure_and_buffer(WiFiClientSecure &client) {
  client.setInsecure();
}

void initFirebase() {
  Serial.println("🔥 Initializing Firebase...");
  set_ssl_client_insecure_and_buffer(ssl_client);
  UserAuth user_auth(API_KEY, USER_EMAIL, USER_PASSWORD, 3000);
  initializeApp(aClient, app, getAuth(user_auth));
  app.getApp<Firestore::Documents>(Docs);
  Serial.println("✅ Firebase initialized");
}

void processFirestoreResult(AsyncResult &result) {
  if (!result.isResult())
    return;

  if (result.isError()) {
    Serial.printf("❌ Firestore Error: %s (code %d)\n",
                  result.error().message().c_str(), result.error().code());
  }

  if (result.available()) {
    Serial.println("✅ Data stored in Firestore successfully");
  }
}

// Legacy upload function for backward compatibility
void uploadVitals(const PatientVitals &vitals) {
  DeviceReading reading = vitals.toDeviceReading();
  uploadDeviceReading(reading, "patient_001"); // Default patient for legacy
}

// Upload enhanced device reading
void uploadDeviceReading(const DeviceReading &reading,
                         const String &patientId) {
  Document<Values::Value> doc;

  // Basic reading info
  doc.add("id", Values::Value(Values::StringValue(reading.id)));
  doc.add("timestamp", Values::Value(Values::StringValue(reading.timestamp)));
  doc.add("deviceId", Values::Value(Values::StringValue(reading.deviceId)));

  // Vital Signs - Heart Rate
  Values::MapValue hrMap("value", Values::DoubleValue(number_t(
                                      reading.vitalSigns.heartRate.value, 1)));
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

  // Vital Signs - SpO2
  Values::MapValue spo2Map(
      "value", Values::DoubleValue(number_t(reading.vitalSigns.spo2.value, 1)));
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

  // Vital Signs - Body Temperature
  Values::MapValue tempMap("value", Values::DoubleValue(number_t(
                                        reading.vitalSigns.bodyTemp.value, 1)));
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

  // Metadata
  doc.add("patientId", Values::Value(Values::StringValue(patientId)));
  doc.add("measurementType",
          Values::Value(Values::StringValue("continuous_monitoring")));
  doc.add("dataQuality", Values::Value(Values::StringValue("good")));

  // Determine overall alert status
  AlertStatus overallStatus = determineOverallAlertStatus(reading.vitalSigns);
  doc.add("alertStatus", Values::Value(Values::StringValue(
                             alertStatusToString(overallStatus))));

  // Upload path: patients/{patientId}/readings/{readingId}
  String path = "patients/" + patientId + "/readings/" + reading.id;

  Serial.printf("📤 Uploading reading to: %s\n", path.c_str());
  Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                      DocumentMask(), doc, firestoreResult);
}

// Upload patient record
void uploadPatientRecord(const PatientRecord &patient) {
  Document<Values::Value> doc;

  // Basic patient info
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

  // Contact information
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

  // Assigned devices array - Initialize properly based on mobizt/FirebaseClient
  // library
  if (patient.assignedDevices.size() > 0) {
    Values::ArrayValue devices(
        Values::Value(Values::StringValue(patient.assignedDevices[0])));
    // Add remaining devices if any
    for (size_t i = 1; i < patient.assignedDevices.size(); i++) {
      devices.add(
          Values::Value(Values::StringValue(patient.assignedDevices[i])));
    }
    doc.add("assignedDevices", Values::Value(devices));
  } else {
    // Handle empty array case
    Values::ArrayValue devices(Values::Value(Values::StringValue("")));
    devices.clear();
    doc.add("assignedDevices", Values::Value(devices));
  }

  // Timestamps
  doc.add("createdAt", Values::Value(Values::StringValue(patient.createdAt)));
  doc.add("updatedAt", Values::Value(Values::StringValue(patient.updatedAt)));

  String path = "patients/" + patient.id;
  Serial.printf("📤 Uploading patient record: %s\n", path.c_str());
  Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                      DocumentMask(), doc, firestoreResult);
}

// Upload device status
void uploadDeviceStatus(const Device &device) {
  Document<Values::Value> doc;

  doc.add("id", Values::Value(Values::StringValue(device.id)));
  doc.add("deviceStatus", Values::Value(Values::StringValue(
                              deviceStatusToString(device.deviceStatus))));

  // Location info
  Values::MapValue location("roomNumber",
                            Values::StringValue(device.location.roomNumber));
  location.add("bedNumber", Values::StringValue(device.location.bedNumber));
  doc.add("location", Values::Value(location));

  doc.add("lastUpdate",
          Values::Value(Values::StringValue(getCurrentTimestamp())));

  String path = "devices/" + device.id;
  Serial.printf("📤 Uploading device status: %s\n", path.c_str());
  Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                      DocumentMask(), doc, firestoreResult);
}

// Upload alert summary
void uploadAlertSummary(const AlertSummary &alert) {
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

  String alertId = "alert_" + String(millis());
  String path = "alerts/" + alertId;

  Serial.printf("🚨 Uploading alert: %s\n", path.c_str());
  Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                      DocumentMask(), doc, firestoreResult);
}

// Update room status
void updateRoomStatus(const String &roomNumber, const RoomStatus &status) {
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

  String path = "rooms/" + roomNumber;
  Serial.printf("🏥 Updating room status: %s\n", path.c_str());
  Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                      DocumentMask(), doc, firestoreResult);
}

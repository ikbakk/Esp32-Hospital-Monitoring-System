#include <config.h>
#include <firebase.h>

bool isFirebaseReady() {
  bool ready = app.ready();
  if (!ready) {
    Serial.println("⚠️  Firebase not ready - check authentication");
  }
  return ready;
}

void processFirestoreResults() {
  if (firestoreResult.isResult()) {
    if (firestoreResult.isError()) {
      Serial.println("❌ Firestore operation failed");
    } else if (firestoreResult.available()) {
      Serial.println("✅ Firestore operation completed successfully");
    }
  }
}

// Upload vital reading to Firestore
void uploadVitalReading(const DeviceReading &reading, const String &patientId) {
  if (!isFirebaseReady())
    return;

  Document<Values::Value> doc = createReadingDocument(reading, patientId);
  String path = "patients/" + patientId + "/readings/" + reading.id;

  Serial.printf("📤 Uploading vital reading: %s\n", path.c_str());
  Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                      DocumentMask(), doc, firestoreResult);
}

// Upload patient record
void uploadPatientRecord(const PatientRecord &patient) {
  if (!isFirebaseReady())
    return;

  Document<Values::Value> doc = createPatientDocument(patient);
  String path = "patients/" + patient.id;

  Serial.printf("📤 Uploading patient: %s\n", path.c_str());
  Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                      DocumentMask(), doc, firestoreResult);
}

// Upload device status
void uploadDeviceStatus(const Device &device) {
  if (!isFirebaseReady())
    return;

  Document<Values::Value> doc = createDeviceDocument(device);
  String path = "devices/" + device.id;

  Serial.printf("📤 Uploading device: %s\n", path.c_str());
  Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                      DocumentMask(), doc, firestoreResult);
}

// Upload alert
void uploadAlert(const AlertSummary &alert) {
  if (!isFirebaseReady())
    return;

  Document<Values::Value> doc = createAlertDocument(alert);
  String alertId = "alert_" + String(millis()) + "_" + alert.roomNumber;
  String path = "alerts/" + alertId;

  Serial.printf("🚨 Uploading alert: %s\n", path.c_str());
  Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                      DocumentMask(), doc, firestoreResult);
}

// Update room status
void updateRoomStatus(const String &roomNumber, const RoomStatus &status) {
  if (!isFirebaseReady())
    return;

  Document<Values::Value> doc = createRoomDocument(status);
  String path = "rooms/" + roomNumber;

  Serial.printf("🏥 Updating room: %s\n", path.c_str());
  Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                      DocumentMask(), doc, firestoreResult);
}

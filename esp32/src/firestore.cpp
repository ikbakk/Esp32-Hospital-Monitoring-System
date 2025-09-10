#include "types.h"
#include <config.h>
#include <firebase.h>

bool isFirebaseReady() {
  bool ready = app.ready();
  if (!ready) {
    Serial.println("⚠️  Firebase not ready - check authentication");
  }
  return ready;
}

bool ensureFirebaseReady(const String &operation) {
  int retryCount = 0;
  const int maxRetries = 3;

  while (retryCount < maxRetries) {
    if (app.ready()) {
      return true;
    }

    Serial.printf("⚠️ Firebase not ready for %s (attempt %d/%d)\n",
                  operation.c_str(), retryCount + 1, maxRetries);
    delay(1000);
    retryCount++;
  }

  Serial.printf("❌ Firebase failed to become ready for %s\n",
                operation.c_str());
  return false;
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

void uploadPatientWithReading(const PatientRecord &patient,
                              const DeviceReading &reading) {
  String patientPath = "patients/" + patient.id;
  String readingPath = patientPath + "/readings/" + reading.id;
  Document<Values::Value> patientDocument = createPatientDocument(patient);
  Document<Values::Value> readingDocument =
      createReadingDocument(reading, patient.id);
  Firestore::Parent parent = Firestore::Parent(FIREBASE_PROJECT_ID);

  if (!isFirebaseReady()) {
    Serial.printf("📤 Uploading patient: %s\n", patient.id.c_str());
  } else {
    Docs.createDocument(aClient, parent, patientPath, DocumentMask(),
                        patientDocument, firestoreResult);
    Docs.createDocument(aClient, parent, readingPath, DocumentMask(),
                        readingDocument, firestoreResult);

    Serial.printf("📤 Uploaded patient: %s\n", patient.id.c_str());
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

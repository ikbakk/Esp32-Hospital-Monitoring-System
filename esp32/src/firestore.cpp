#include "types.h"
#include "vitals.h"
#include <config.h>
#include <firebase.h>

Firestore::Parent parent = Firestore::Parent(FIREBASE_PROJECT_ID);

void processFirestoreResults() {
  if (firestoreResult.isResult()) {
    if (firestoreResult.isError()) {
      Serial.println("❌ Firestore operation failed");
    } else if (firestoreResult.available()) {
      Serial.println("✅ Firestore operation completed successfully");
    }
  }
}

void uploadPatientReadings(const DeviceReading &reading) {
  String readingId = getCurrentTimestamp();
  String path = "patients/" + patientId + "/readings/" + readingId;
  Document<Values::Value> readingDocument = createReadingDocument(reading);

  Docs.createDocument(aClient, parent, path, DocumentMask(), readingDocument,
                      firestoreResult);

  Serial.println("✅ Reading document uploaded successfully");
}

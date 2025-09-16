#include "config.h"
#include <firebase.h>
#include <utils.h>

// ==================== GLOBALS ====================
FirebaseApp app;
WiFiClientSecure ssl_client;
AsyncClientClass aClient(ssl_client);
UserAuth user_auth(API_KEY, USER_EMAIL, USER_PASSWORD, AUTH_EXPIRE_PERIOD);
AsyncResult firestoreResult;
Firestore::Documents Docs;
Firestore::Parent parent = Firestore::Parent(FIREBASE_PROJECT_ID);

String getCollectionPath() {
  return "rooms/" + devConfig.roomNumber + "/patients/" + devConfig.patientId +
         "/readings/";
}

// ==================== INITIALIZATION ====================
void initFirebase() {
  Serial.println("🔄 Initializing Firebase...");

  // Configure SSL
  ssl_client.setInsecure();

  // Initialize Firebase app
  initializeApp(aClient, app, getAuth(user_auth));
  app.getApp<Firestore::Documents>(Docs);
  app.autoAuthenticate(true);

  Serial.println("✅ Firebase initialized");
}

// ==================== RESULT PROCESSING ====================
void processFirestoreResults(String message) {
  if (firestoreResult.isResult()) {
    if (firestoreResult.isError()) {
      Serial.printf("❌ Firestore Error: %s\n",
                    firestoreResult.error().message().c_str());
    } else if (firestoreResult.available()) {
      if (DEBUG_FIREBASE) {
        Serial.println("✅ Firestore operation completed: " + message);
      }
    }
    firestoreResult.clear(); // IMPORTANT: Clear the result
  }
}

// ==================== DOCUMENT HELPERS ====================
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

Document<Values::Value> createReadingDocument(const DeviceReading &reading) {
  Document<Values::Value> doc;

  addField(doc, "heartRate", reading.vitalSigns.heartRate);
  addField(doc, "spo2", reading.vitalSigns.spo2);
  addField(doc, "bodyTemp", reading.vitalSigns.bodyTemp);

  if (DEBUG_VITALS) {
    Serial.printf("📊 HR: %.1f | SpO2: %.1f%% | Temp: %.1f°C\n",
                  reading.vitalSigns.heartRate, reading.vitalSigns.spo2,
                  reading.vitalSigns.bodyTemp);
  }

  return doc;
}

Document<Values::Value> createRoomDocument() {
  Document<Values::Value> doc;

  addField(doc, "id", devConfig.deviceId);
  addField(doc, "roomNumber", devConfig.roomNumber);
  addField(doc, "bedNumber", devConfig.bedNumber);

  return doc;
}

// ==================== UPLOAD FUNCTION ====================
void uploadReading(const DeviceReading &reading) {
  String timestamp = getTimestamp();
  String collectionPath = getCollectionPath();
  String path = collectionPath + timestamp;
  Document<Values::Value> doc = createReadingDocument(reading);

  Docs.createDocument(aClient, parent, path, DocumentMask(), doc,
                      firestoreResult);

  if (DEBUG_VITALS) {
    processFirestoreResults("Reading uploaded");
  }
}

bool roomExists(String path) {
  // Use the async version that populates firestoreResult
  Docs.get(aClient, parent, path, GetDocumentOptions(), firestoreResult);

  if (!firestoreResult.isError()) {
    firestoreResult.clear();
    return true; // document exists
  }

  if (firestoreResult.error().code() == 404) {
    firestoreResult.clear();
    return false; // not found
  }

  // Some other error (network, auth, etc.)
  firestoreResult.clear();
  return false;
}

void uploadRoom() {
  String path = "rooms/" + devConfig.roomNumber;

  if (roomExists(path)) {
    // Serial.println("ℹ️ Room already exists, skipping creation");
    updateRoomCreated(true);
    return;
  }

  Document<Values::Value> doc = createRoomDocument();
  Docs.createDocument(aClient, parent, path, DocumentMask(), doc,
                      firestoreResult);

  if (!firestoreResult.isError()) {
    Serial.printf("✅ Room %s created\n", devConfig.roomNumber.c_str());
    updateRoomCreated(true);
  } else {
    Serial.printf("⚠️ Failed to create room: %s\n",
                  firestoreResult.error().message().c_str());
    updateRoomCreated(false);
  }

  firestoreResult.clear();
}

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

void auth_debug_print(AsyncResult &aResult) {
  if (aResult.isEvent()) {
    Firebase.printf("Event task: %s, msg: %s, code: %d\n",
                    aResult.uid().c_str(), aResult.eventLog().message().c_str(),
                    aResult.eventLog().code());
  }

  if (aResult.isDebug()) {
    Firebase.printf("Debug task: %s, msg: %s\n", aResult.uid().c_str(),
                    aResult.debug().c_str());
  }

  if (aResult.isError()) {
    Firebase.printf("Error task: %s, msg: %s, code: %d\n",
                    aResult.uid().c_str(), aResult.error().message().c_str(),
                    aResult.error().code());
  }
}

void processData(AsyncResult &aResult) {
  // Exits when no result is available when calling from the loop.
  if (!aResult.isResult())
    return;

  if (aResult.isEvent()) {
    Firebase.printf("Event task: %s, msg: %s, code: %d\n",
                    aResult.uid().c_str(), aResult.eventLog().message().c_str(),
                    aResult.eventLog().code());
  }

  if (aResult.isDebug()) {
    Firebase.printf("Debug task: %s, msg: %s\n", aResult.uid().c_str(),
                    aResult.debug().c_str());
  }

  if (aResult.isError()) {
    Firebase.printf("Error task: %s, msg: %s, code: %d\n",
                    aResult.uid().c_str(), aResult.error().message().c_str(),
                    aResult.error().code());
  }

  if (aResult.available()) {
    Firebase.printf("task: %s, payload: %s\n", aResult.uid().c_str(),
                    aResult.c_str());
  }
}

// ==================== INITIALIZATION ====================
void initFirebase() {
  Serial.println("🔄 Initializing Firebase...");

  // Configure SSL
  ssl_client.setInsecure();

  // Initialize Firebase app
  initializeApp(aClient, app, getAuth(user_auth), auth_debug_print,
                "auth task:");
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
  addField(doc, "timestamp", getTimestamp());

  if (DEBUG_VITALS) {
    Serial.printf("📊 HR: %.1f | SpO2: %.1f%% | Temp: %.1f°C\n",
                  reading.vitalSigns.heartRate, reading.vitalSigns.spo2,
                  reading.vitalSigns.bodyTemp);
  }

  return doc;
}

Document<Values::Value> createPatientDocument() {
  Document<Values::Value> doc;

  addField(doc, "id", basePatientConfig.id);
  addField(doc, "name", basePatientConfig.name);
  addField(doc, "age", basePatientConfig.age);
  addField(doc, "gender", basePatientConfig.gender);
  addField(doc, "admissionDate", basePatientConfig.admissionDate);

  // Build nested object for location

  Values::MapValue locationMap;
  locationMap.add("room", Values::Value(Values::StringValue(
                              basePatientConfig.location.room)));
  locationMap.add("bed", Values::Value(Values::StringValue(
                             basePatientConfig.location.bed)));

  // Attach nested object
  doc.add("location", Values::Value(locationMap));

  return doc;
};

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
  String collectionPath =
      "patients/" + devConfig.patientId + "/readings/" + timestamp;
  String path = collectionPath;
  Document<Values::Value> doc = createReadingDocument(reading);

  Docs.createDocument(aClient, parent, path, DocumentMask(), doc,
                      firestoreResult);

  if (DEBUG_VITALS) {
    processFirestoreResults("Reading uploaded");
  }
}

bool documentChecker(const String &path) {
  Serial.printf("🔎 Checking Firestore path: %s\n", path.c_str());

  // Try to get the document (sync, blocks until reply)
  String payload = Docs.get(aClient, Firestore::Parent(FIREBASE_PROJECT_ID),
                            path, GetDocumentOptions());

  if (aClient.lastError().code() == 0) {
    Serial.println("✅ Document exists!");
    Serial.println(payload); // you can print or parse it if needed
    return true;
  }

  if (aClient.lastError().code() == 404) {
    Serial.println("❌ Document not found (404)");
    return false;
  }

  // Any other error (e.g. network, auth, timeout)
  Serial.printf("⚠️ Error while checking: %s (code %d)\n",
                aClient.lastError().message().c_str(),
                aClient.lastError().code());
  return false;
}

void uploadRoom() {
  String path = "rooms/" + devConfig.roomNumber;

  if (documentChecker(path)) {
    Serial.printf("ℹ️ Room %s already exists, skipping creation\n",
                  devConfig.roomNumber.c_str());
    updateRoomCreated(true);
    roomCreated = true;
    return;
  }

  // Build document data
  Document<Values::Value> doc = createRoomDocument();

  Serial.printf("📤 Creating new room %s...\n", devConfig.roomNumber.c_str());

  String payload =
      Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                          DocumentMask(), doc);

  if (aClient.lastError().code() == 0) {
    Serial.printf("✅ Room %s created successfully\n",
                  devConfig.roomNumber.c_str());
    updateRoomCreated(true);
    roomCreated = true;
  } else {
    Serial.printf("⚠️ Failed to create room: %s (code %d)\n",
                  aClient.lastError().message().c_str(),
                  aClient.lastError().code());
    updateRoomCreated(false);
    roomCreated = false;
  }
}

void uploadBasePatient() {
  String path = "patients/" + basePatientConfig.id;

  if (documentChecker(path)) {
    Serial.printf("ℹ️ Document %s already exists, skipping creation\n",
                  basePatientConfig.id.c_str());
    updateRoomCreated(true);
    basePatientCreated = true;
    return;
  }

  // Build document data
  Document<Values::Value> doc = createPatientDocument();

  Serial.printf("📤 Creating new patient base data %s...\n",
                devConfig.roomNumber.c_str());

  String payload =
      Docs.createDocument(aClient, Firestore::Parent(FIREBASE_PROJECT_ID), path,
                          DocumentMask(), doc);

  if (aClient.lastError().code() == 0) {
    Serial.printf("✅ Base data %s created successfully\n",
                  basePatientConfig.id.c_str());
    updateRoomCreated(true);
    basePatientCreated = true;
  } else {
    Serial.printf("⚠️ Failed to create document: %s (code %d)\n",
                  aClient.lastError().message().c_str(),
                  aClient.lastError().code());
    updateRoomCreated(false);
    basePatientCreated = false;
  }
}

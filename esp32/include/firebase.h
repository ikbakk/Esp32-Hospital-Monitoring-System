#pragma once

#define ENABLE_FIRESTORE
#define ENABLE_USER_AUTH

#include <FirebaseClient.h>
#include <WiFiClientSecure.h>
#include <types.h>

extern FirebaseApp app;
extern UserAuth user_auth;
extern WiFiClientSecure ssl_client;
extern AsyncClientClass aClient;
extern AsyncResult firestoreResult;
extern Firestore::Documents Docs;
extern Firestore::Parent parent;

// ==================== FUNCTIONS ====================
void initFirebase();
void processFirestoreResults();
void uploadReading(const DeviceReading &reading);

// ==================== DOCUMENT HELPERS ====================
void addField(Document<Values::Value> &doc, const String &key,
              const String &value);
void addField(Document<Values::Value> &doc, const String &key, int value);
void addField(Document<Values::Value> &doc, const String &key, double value);
Document<Values::Value> createReadingDocument(const DeviceReading &reading);

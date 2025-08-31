#pragma once

// Enable Firebase features BEFORE including client
#define ENABLE_USER_AUTH
#define ENABLE_FIRESTORE

#include <FirebaseClient.h>
#include <WiFiClientSecure.h>
#include <types.h>
#include <vitals.h>

// Global Firebase objects
extern FirebaseApp app;
extern AsyncResult firestoreResult;
extern Firestore::Documents Docs;

// Core Firebase functions
void initFirebase();
void processFirestoreResult(AsyncResult &result);

// Upload functions for different data types
void uploadVitals(const PatientVitals &vitals); // Legacy function
void uploadDeviceReading(const DeviceReading &reading, const String &patientId);
void uploadPatientRecord(const PatientRecord &patient);
void uploadDeviceStatus(const Device &device);
void uploadAlertSummary(const AlertSummary &alert);
void updateRoomStatus(const String &roomNumber, const RoomStatus &status);

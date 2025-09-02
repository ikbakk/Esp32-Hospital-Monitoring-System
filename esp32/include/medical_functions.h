#ifndef MEDICAL_FUNCTIONS_H
#define MEDICAL_FUNCTIONS_H

#include <config.h>
#include <firebase.h>
#include <types.h>
#include <vitals.h>

// External variables (defined in main.cpp)
extern const String deviceId;
extern const String patientId;
extern const String roomNumber;
extern const String bedNumber;

bool ensureFirebaseReady(const String &operation);

// Data creation functions
PatientRecord createSamplePatient();
Device createSampleDevice();
RoomStatus createRoomStatus();

// Upload functions
void uploadAlertData(const DeviceReading &reading, AlertStatus alertLevel);
void generateAndUploadVitals();
void uploadCompletePatientRecord();
void uploadCompleteDeviceStatus();
void uploadCompleteRoomStatus();
void uploadInitialData();

#endif // MEDICAL_FUNCTIONS_H

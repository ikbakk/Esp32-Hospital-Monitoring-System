# 🏥 ESP32 Medical Monitoring System

A comprehensive medical monitoring system that simulates patient vital signs and uploads structured medical data to Firebase Firestore, designed to integrate with TypeScript/React frontends.

## 📁 Project Structure

```
medical-monitor-esp32/
├── platformio.ini                 # PlatformIO configuration
├── scripts/
│   ├── generate_compile_commands.py
│   └── post_build.py
├── include/                       # Header files
│   ├── config.h                   # System configuration
│   ├── medical_types.h            # Medical data structures
│   ├── vitals.h                   # Vital signs generation
│   └── firebase_setup.h           # Firebase operations
├── src/                          # Implementation files
│   ├── main.cpp                   # Main application
│   ├── medical_types.cpp          # Medical types implementation
│   ├── vitals.cpp                 # Vitals generation logic
│   └── firebase_setup.cpp         # Firebase implementation
└── README.md                      # This file
```

## 🎯 Features

### **Medical Data Types**
- **Patient Records**: Complete patient information matching your TypeScript interfaces
- **Vital Signs**: Heart rate, SpO2, body temperature with alert detection
- **Device Management**: Device status, location tracking, maintenance modes
- **Alert System**: Multi-level alert detection (warning, critical)
- **Room Status**: Real-time room occupancy and monitoring status

### **Firebase Integration**
- **Structured Data**: Matches your TypeScript interfaces exactly
- **Real-time Uploads**: Automatic data synchronization
- **Multiple Collections**: Patients, devices, readings, alerts, rooms
- **Error Handling**: Robust error detection and reporting

### **Alert System**
- **Automatic Detection**: Configurable thresholds for all vitals
- **Multi-level Alerts**: Warning and critical status levels
- **Alert Persistence**: Tracks alert counts and duration
- **Real-time Notifications**: Immediate alert uploads to Firestore

## ⚙️ Configuration

### **1. WiFi & Firebase Setup**
Edit `include/config.h`:
```cpp
#define WIFI_SSID "your_wifi_name"
#define WIFI_PASSWORD "your_wifi_password"
#define API_KEY "your_firebase_api_key"
#define USER_EMAIL "your_email@domain.com"
#define USER_PASSWORD "your_password"
#define FIREBASE_PROJECT_ID "your_project_id"
```

### **2. Device Configuration**
```cpp
#define DEVICE_ID "esp32_monitor_001"
#define DEFAULT_PATIENT_ID "patient_001"
#define DEFAULT_ROOM_NUMBER "101"
#define DEFAULT_BED_NUMBER "A"
```

### **3. Vital Sign Thresholds**
Customize alert thresholds in `config.h`:
```cpp
struct AlertThresholds {
  struct {
    float warningLow = 50.0;    // Heart rate warning low
    float warningHigh = 120.0;  // Heart rate warning high
    float criticalLow = 40.0;   // Heart rate critical low
    float criticalHigh = 150.0; // Heart rate critical high
  } heartRate;
  // ... SpO2 and temperature thresholds
};
```

## 🚀 Quick Start

### **1. Hardware Setup**
- ESP32 development board
- USB cable for programming
- Optional: Real sensors (can work with simulated data)

### **2. Software Setup**
```bash
# Install PlatformIO
pip install platformio

# Clone/create project
mkdir medical-monitor-esp32 && cd medical-monitor-esp32

# Build and upload
pio run --target upload

# Monitor serial output
pio device monitor
```

### **3. Generate LSP Support**
```bash
# Generate compile_commands.json for Neovim/VSCode
pio run --target compiledb
```

## 📊 Data Structure Examples

### **Device Reading Upload**
```json
// Firestore path: patients/{patientId}/readings/{readingId}
{
  "id": "reading_12345_1693456789",
  "timestamp": "2025-08-31T10:30:00Z",
  "deviceId": "esp32_monitor_001",
  "patientId": "patient_001",
  "readingSequence": 45,
  "vitalSigns": {
    "heartRate": {
      "value": 78,
      "alert": {
        "status": "none",
        "warningCount": 0,
        "criticalCount": 0
      }
    },
    "spo2": {
      "value": 97.5,
      "alert": {
        "status": "none",
        "warningCount": 0,
        "criticalCount": 0
      }
    },
    "bodyTemp": {
      "value": 36.8,
      "alert": {
        "status": "none",
        "warningCount": 0,
        "criticalCount": 0
      }
    }
  },
  "alertStatus": "none",
  "measurementType": "continuous_monitoring",
  "dataQuality": "good"
}
```

### **Patient Record Upload**
```json
// Firestore path: patients/{patientId}
{
  "id": "patient_001",
  "name": "John Doe",
  "age": 45,
  "roomNumber": "101",
  "bedNumber": "A",
  "condition": "normal",
  "contactInfo": {
    "phone": "+1234567890",
    "email": "john.doe@email.com",
    "emergencyContact": "Jane Doe",
    "emergencyPhone": "+1234567891"
  },
  "attendingPhysician": "Dr. Smith",
  "assignedNurse": "Nurse Johnson",
  "bloodType": "O+",
  "assignedDevices": ["esp32_monitor_001"],
  "monitoringStatus": "active",
  "createdAt": "2025-08-31T08:00:00Z",
  "updatedAt": "2025-08-31T10:30:00Z"
}
```

### **Alert Upload**
```json
// Firestore path: alerts/{alertId}
{
  "patientName": "John Doe",
  "roomNumber": "101",
  "activeAlerts": {
    "heartRate": "warning",
    "spo2": "none",
    "bodyTemp": "none"
  },
  "alertCount": 1,
  "lastAlertTime": "2025-08-31T10:30:00Z",
  "severity": "medium"
}
```

## 🔧 Customization

### **Adding New Vital Signs**
1. **Extend VitalSigns structure** in `medical_types.h`
2. **Add generation logic** in `vitals.cpp`
3. **Update Firebase upload** in `firebase_setup.cpp`
4. **Configure thresholds** in `config.h`

### **Custom Alert Logic**
Modify `checkVitalAlert()` function in `vitals.cpp`:
```cpp
VitalAlert checkVitalAlert(float value, float warningLow, float warningHigh, 
                          float criticalLow, float criticalHigh) {
  // Custom alert logic here
}
```

### **Different Patient Scenarios**
Enable different simulation modes in `config.h`:
```cpp
struct SimulationSettings {
  bool simulateStablePatient = true;
  bool simulateFeverPatient = false;
  bool simulateTachycardiaPatient = false;
  bool simulateHypoxiaPatient = false;
};
```

## 📈 Monitoring & Debug

### **Serial Monitor Output**
```
🏥 Medical Monitoring System Starting...
✅ WiFi connected: 192.168.1.100
🔥 Initializing Firebase...
✅ Firebase initialized

📊 Generating vital signs reading...
   💓 Heart Rate: 78 bpm (none)
   🫁 SpO2: 97.5% (none) 
   🌡️  Temperature: 36.8°C (none)
✅ Data stored in Firestore successfully
```

### **Alert Example**
```
📊 Generating vital signs reading...
   💓 Heart Rate: 125 bpm (warning)
   🫁 SpO2: 96.2% (none)
   🌡️  Temperature: 36.9°C (none)
🚨 ALERT: warning condition detected!
🚨 Uploading alert: alerts/alert_1693456789
✅ Data stored in Firestore successfully
```

## 🔌 Frontend Integration

Your TypeScript interfaces will receive data in this exact structure. Example frontend usage:

```typescript
// Subscribe to patient readings
const unsubscribe = onSnapshot(
  collection(db, `patients/${patientId}/readings`),
  (snapshot) => {
    snapshot.docs.forEach(doc => {
      const reading: DeviceReading = doc.data();
      // Process real-time vital signs
      console.log(`HR: ${reading.vitalSigns.heartRate.value} bpm`);
    });
  }
);

// Check for active alerts
const alertQuery = query(
  collection(db, 'alerts'),
  where('alertCount', '>', 0),
  orderBy('lastAlertTime', 'desc')
);
```

## 📝 TODO / Roadmap

- [ ] Add real sensor integration (MAX30102, DS18B20, etc.)
- [ ] Implement OTA updates
- [ ] Add local data storage/buffering
- [ ] Multi-patient support on single device
- [ ] Bluetooth connectivity options
- [ ] Advanced alert escalation system
- [ ] Historical data analysis
- [ ] Power management optimizations

## 🤝 Contributing

This system is designed to be modular and extensible. Feel free to:
- Add new vital sign types
- Implement real sensor drivers
- Enhance alert algorithms
- Improve data structures
- Add new Firebase collections

## 📄 License

This project is designed for educational and development purposes. Ensure compliance with medical device regulations before deployment in clinical environments.

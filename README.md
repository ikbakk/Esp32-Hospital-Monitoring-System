# ESP32 Medical Monitoring System

A comprehensive medical monitoring system using ESP32 with MAX30100 (heart rate & SpO2) and MLX90614 (body temperature) sensors, integrated with Supabase for real-time data storage and monitoring.

## 🏗️ Architecture

- **Core 1**: Dedicated to sensor readings (MAX30100 & MLX90614)
- **Core 0**: Handles network operations and Supabase communication
- **FreeRTOS**: Task management and inter-core communication
- **Supabase**: PostgreSQL database with real-time subscriptions

## 📋 Requirements

### Hardware
- ESP32 Development Board
- MAX30100 Heart Rate & SpO2 Sensor
- MLX90614 Infrared Temperature Sensor
- Breadboard and jumper wires
- Optional: Status LEDs

### Software
- PlatformIO IDE or CLI
- Supabase account and project
- WiFi network

## 🔧 Hardware Setup

### Pin Connections

| Component | ESP32 Pin | Notes |
|-----------|-----------|-------|
| MAX30100 SDA | GPIO 21 | I2C Data |
| MAX30100 SCL | GPIO 22 | I2C Clock |
| MAX30100 VCC | 3.3V | Power |
| MAX30100 GND | GND | Ground |
| MLX90614 SDA | GPIO 21 | Shared I2C Data |
| MLX90614 SCL | GPIO 22 | Shared I2C Clock |
| MLX90614 VCC | 3.3V | Power |
| MLX90614 GND | GND | Ground |
| Status LED | GPIO 2 | Optional |

### I2C Addresses
- MAX30100: 0x57 (default)
- MLX90614: 0x5A (default)

## 🚀 Software Setup

### 1. Clone and Setup Project

```bash
# Create new PlatformIO project
pio project init --board esp32dev

# Copy the provided files:
# - src/main.cpp (main ESP32 code)
# - include/config.h (configuration header)
# - platformio.ini (PlatformIO configuration)
```

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```env
WIFI_SSID=your_wifi_network
WIFI_PASSWORD=your_wifi_password
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

Or modify the config.h file directly with your credentials.

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the provided schema script
3. Get your project URL and anon key from Settings > API
4. Update your configuration with these credentials

### 4. Install Dependencies

PlatformIO will automatically install the required libraries:
- oxullo MAX30100lib (Heart Rate & SpO2)
- Adafruit MLX90614 Library (Temperature)
- ArduinoJson (JSON handling)
- WiFi libraries (ESP32 built-in)

### 5. Build and Upload

```bash
# Build the project
pio run

# Upload to ESP32
pio run --target upload

# Monitor serial output
pio device monitor
```

## 📊 Database Schema

### Main Tables

#### `patients`
- Patient demographic and medical information
- Room/bed assignments
- Contact information

#### `readings`
- Real-time sensor data (heart rate, SpO2, body temperature)
- Device identification
- Timestamp with timezone

#### `devices`
- ESP32 device management
- Status monitoring
- Firmware tracking

#### `alerts`
- Automated alerts for critical readings
- Severity levels (info, warning, critical)
- Acknowledgment tracking

## 🔄 System Operation

### Sensor Monitoring & Connection Management
- **Automatic Detection**: Continuously monitors sensor connectivity
- **Blocking Behavior**: Stops all operations when sensors are disconnected
- **Auto-Recovery**: Automatically reconnects when sensors come back online
- **Error Tracking**: Counts consecutive sensor errors before marking as disconnected
- **Visual Feedback**: Status LED blinks when waiting for sensor connection

### Sensor Reading Task (Core 1)
- Continuously monitors sensor connectivity
- **Blocks all operations when sensors are disconnected**
- Reads MAX30100 every 100ms for optimal accuracy
- Reads MLX90614 body temperature every 5 seconds
- Validates readings and queues for upload
- Automatic reconnection when sensors come back online

### Network Task (Core 0)  
- Batches sensor readings for efficient upload
- Manages WiFi connection and reconnection
- Uploads data to Supabase every 30 seconds
- Handles HTTP timeouts and retries

### Watchdog Task
- Monitors system health
- Checks task responsiveness
- Monitors memory usage
- Triggers system restart on critical errors

## 📈 Data Flow

```
Sensors → Core 1 Task → Queue → Core 0 Task → Supabase → Frontend
```

1. **Sensor Reading**: Core 1 continuously reads sensors
2. **Data Validation**: Filters invalid readings
3. **Queue Management**: Thread-safe data transfer between cores
4. **Batch Upload**: Core 0 uploads data in batches
5. **Real-time Updates**: Supabase provides real-time subscriptions

## 🚨 Alert System

### Critical Thresholds
- **Heart Rate**: < 50 or > 150 BPM
- **SpO2**: < 85%
- **Body Temperature**: < 35°C or > 39°C

### Alert Levels
- **Info**: Normal status updates
- **Warning**: Values outside normal range
- **Critical**: Life-threatening values

## 🔧 Configuration

### Timing Settings
```cpp
#define READING_INTERVAL_MS 5000     // 5 seconds
#define UPLOAD_INTERVAL_MS 30000     // 30 seconds
#define WATCHDOG_INTERVAL_MS 30000   // 30 seconds
```

### Sensor Validation
```cpp
#define MIN_HEART_RATE 50
#define MAX_HEART_RATE 200
#define MIN_SPO2 70
#define MAX_SPO2 100
#define MIN_BODY_TEMP 30.0
#define MAX_BODY_TEMP 45.0
```

## 🐛 Troubleshooting

### Common Issues

**Sensors Not Detected**
- Check I2C wiring and connections
- Verify 3.3V power supply
- System will automatically wait and retry connection
- Status LED will blink when sensors are disconnected
- Check serial output for detailed connection status

**WiFi Connection Issues**
- Verify SSID and password
- Check signal strength
- Try different WiFi channels

**Upload Failures**
- Verify Supabase credentials
- Check internet connectivity
- Review Supabase logs

**Memory Issues**
- Monitor free heap in serial output
- Reduce queue size if needed
- Check for memory leaks

### Debug Output

Enable debug flags in config.h:
```cpp
#define DEBUG_SENSORS 1
#define DEBUG_NETWORK 1
#define DEBUG_MEMORY 1
```

## 📊 Monitoring

### Serial Monitor Output
```
=== ESP32 Medical Monitoring System ===
WiFi connected! IP: 192.168.1.100
🔍 Checking sensor connections...
✅ MAX30100 reconnected!
✅ MLX90614 reconnected!
🎉 All sensors connected and ready!
Sensor task started on Core 1
Network task started on Core 0
💓 Beat Detected!
Reading: HR=72.0, SpO2=98.0, Temp=36.50°C
Uploading 6 readings to Supabase...
Upload successful!

--- If sensor disconnected ---
❌ MAX30100 disconnected!
🚨 SENSOR CONNECTION LOST - Blocking operations!
⏳ Waiting for sensors to connect...
   MAX30100: ❌ Disconnected (errors: 3)
   MLX90614: ✅ Connected (errors: 0)
```

### System Health Metrics
- Free heap memory
- Queue utilization
- Task responsiveness
- Network connectivity

## 🔮 Future Enhancements

- [ ] Battery monitoring and low-power modes
- [ ] Local data storage (SD card backup)
- [ ] Over-the-air (OTA) firmware updates
- [ ] Multiple patient support per device
- [ ] Advanced signal processing for better accuracy
- [ ] Bluetooth connectivity for mobile apps
- [ ] Edge AI for predictive analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test thoroughly with hardware
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Medical Disclaimer

This system is for educational and development purposes only. It should not be used for actual medical diagnosis or treatment without proper medical device certification and regulatory approval.

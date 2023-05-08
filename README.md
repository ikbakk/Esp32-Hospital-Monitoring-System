# ESP32 Hospital monitoring system

As a project for my college degree, a react app modifying
[Hospital monitoing dashboard by DamascenoRafael](https://github.com/DamascenoRafael/hospital-monitor-dashboard) by changing it from MQTT protocols into using Firebase Realtime Database combined with Espressif ESP32 to get Heartrate, Spo2, and Temperature. Also migrate using Next.js

## Features

- CRUD
- Realtime monitor
- Downloadable readings history with timestamp (.csv)
- Color coded notification in card header
- Almost the same as [Hospital monitoing dashboard by DamascenoRafael](https://github.com/DamascenoRafael/hospital-monitor-dashboard)

## Color Reference for Card's Heading

| Color                                        | Hex                                                              |
| -------------------------------------------- | ---------------------------------------------------------------- |
| Danger (All Sensor Readings below parameter) | ![#FF554A](https://via.placeholder.com/10/FF554A?text=+) #FF554A |
| Warning (Oxymeter Sensor Readings)           | ![#ff9e4a](https://via.placeholder.com/10/ff9e4a?text=+) #ff9e4a |
| Warning (Temperature Sensor Readings)        | ![#FFC74A](https://via.placeholder.com/10/FFC74A?text=+) #FFC74A |
| Normal                                       | ![#4aff70](https://via.placeholder.com/10/4aff70?text=+) #4aff70 |
| Newly Added Card / Deleted Data              | ![#fcf0f0](https://via.placeholder.com/10/fcf0f0?text=+) #fcf0f0 |

## Environment Variables

To connect to firebase RTDB, you will need to add the following environment variables to your .env file

`REACT_APP_FirebaseApiKey="apiKey"`

`REACT_APP_FirebaseAuthDomain="authDomain"`

`REACT_APP_FirebaseProjectId="firebaseProjectId"`

`REACT_APP_FirebaseStorageBucket="StorageBucket"`

`REACT_APP_FirebaseMessagingSenderId="msgSenderId"`

`REACT_APP_FirebaseAppId="appId"`

You can find the config [Firebase Console](https://console.firebase.google.com) under Project Settings or if you want to directly edit the
[firebase.config.js](https://github.com/ikbakkk/Esp32-Hospital-Monitoring-System/blob/main/src/config/firebase.config.js) it's the same.

## Tech

- Next.js
- [Firebase Realtime Database](https://firebase.google.com/products/realtime-database)
- [React Query Firebase Hook](react-query-firebase.invertase.dev)
- [React Query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/)
- [Toastify](https://fkhadra.github.io/react-toastify/)
- [Recharts](https://recharts.org)

**Library for used sensor in this project**

- [Firebase arduino client for ESP8266 & ESP32](https://github.com/mobizt/Firebase-ESP-Client)
- [Adafruit-MLX90614-Library](https://github.com/adafruit/Adafruit-MLX90614-Library)
- [Arduino-MAX30100 by oxullo](https://github.com/oxullo/Arduino-MAX30100)

## Firebase realtime database JSON format

JSON format for firebase realtime databse

```json
{
  "userId": { //main node path for react query firebase hook
    "1": { // sensor id
      "nama": "nama pasien",
      "nilai": {
        "-NHFthuz-7J7H71noisX": { //this node name will randomly created by ESP32
          "beat": 0,
          "spo2": 0,
          "temp": 0,
          "timestamp": 0
        },
        "-NHFthv1Kuf5ohur0YOd": {
          "beat": beat,
          "spo2": spo2,
          "temp": temp,
          "timestamp": timestamp
        },
        {...},
        {...},
    }
    "2": {...},
    "3": {...},
```

<!-- **How it's look like in firebase console**

![node](https://github.com/ikbakkk/Esp32-Hospital-Monitoring-System/blob/main/images/nodeData.png?raw=true)
## Screenshots

![main](https://github.com/ikbakkk/Esp32-Hospital-Monitoring-System/blob/main/images/Home.png?raw=true)

![bar](https://github.com/ikbakkk/Esp32-Hospital-Monitoring-System/blob/main/images/barcharts.png?raw=true)

![history](https://github.com/ikbakkk/Esp32-Hospital-Monitoring-System/blob/main/images/history.png?raw=true)

![gif](https://github.com/ikbakkk/Esp32-Hospital-Monitoring-System/blob/main/images/gif.gif?raw=true) -->

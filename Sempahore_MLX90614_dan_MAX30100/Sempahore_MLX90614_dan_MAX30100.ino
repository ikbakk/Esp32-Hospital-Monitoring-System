#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#include "Adafruit_MLX90614.h"
#include <math.h>
#include "addons/TokenHelper.h" //Provide the token generation process info.
#include "addons/RTDBHelper.h"  //Provide the RTDB payload printing info and other helper functions.
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

//Start Wifi
#define WIFI_SSID "" //SSID
#define WIFI_PASSWORD "" //Password
//End Wifi

//Start Firebase
#define API_KEY "-" // Insert Firebase project API Key
#define DATABASE_URL "" // Insert RTDB URLefine the RTDB URL */
FirebaseData FirebaseData;  //Firebase data object
FirebaseAuth auth;  //Firebase authentication object
FirebaseConfig config;  //Firebase configuration object
//End Firebase

// Start max30100 + mlx90614
#define POX_REPORTING_PERIOD_MS  1000
#define I2C_SDA_21
#define I2C_SCL_22

PulseOximeter pox;  // Create a PulseOximeter object
Adafruit_MLX90614 mlx = Adafruit_MLX90614(); // Create a temp sensor object
TaskHandle_t GetReadings;
int _spo2;
int _heartRate;
float _temp;
uint32_t poxLastReport = 0;
uint32_t prevMillis = 0;
// End Pulse max30100 + mlx90614

TaskHandle_t PostToFirebase;
bool signupOK = false;

// Start Function Declaration
void SendReadingsToFirebase();
void InitializeWifi();
void SignUpToFirebase();
void InitializePOX();
// End Function Declaration



void setup() {
  Serial.begin(115200); //Begin serial communication
  InitializeWifi(); //begin wifi
  SignUpToFirebase(); //login to firebase
  InitializePOX(); //start sensors
  xTaskCreatePinnedToCore(SensorReadings, "GetReadings", 1724, NULL, 0, &GetReadings, 0); //core 0 for reading task
 xTaskCreatePinnedToCore(SendReadingsToFirebase, "PostToFirebase", 6268, NULL, 0, &PostToFirebase, 1);// core 1 for send to firebase rtdb
}

void SensorReadings(void * parameter)
{
  for(;;)
  {
    // Read from the sensor
    pox.update();//start max30100
    mlx.begin();//start mlx90614
      
    if (millis() - poxLastReport > POX_REPORTING_PERIOD_MS) {
      _heartRate = round(pox.getHeartRate()); //variable for hr
      _spo2 = round(pox.getSpO2()); // variable for spo2
      _temp = mlx.readObjectTempC(); // variable for temp
    
      Serial.print("Heart rate:");  
      Serial.print(_heartRate);
      Serial.print("bpm / SpO2:");
      Serial.print(_spo2);
      Serial.println("%");
      Serial.print("Temp:");
      Serial.println(_temp);
    
      poxLastReport = millis();
    }
    // Memory Sizing
    //if (millis() - prevMillis > 6000)
    //{
    //  unsigned long remainingStack = uxTaskGetStackHighWaterMark(NULL);
    //  Serial.print("Free stack: ");
    //  Serial.print(remainingStack);
    //  prevMillis = millis();
    //}
    // End Memory Sizing
  }
}

void SendReadingsToFirebase(void * parameter)
{
  for(;;)
  {
    if (Firebase.ready() && signupOK){ //send sensor readings to rtdb nodes
      FirebaseJson json;
      json.set("beat", int(_heartRate));
      json.set("spo2", int(_spo2));
      json.set("temp", int(_temp));
      json.set("timestamp/.sv", "timestamp");
      Firebase.RTDB.pushJSON(&FirebaseData, "userId/1/nilai", &json);
    }
  }
}

void InitializeWifi()
{
  // Wifi Initialize ...
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
}

void SignUpToFirebase()
{
  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", ""))
  {
    Serial.println("ok");
    signupOK = true;
  }
  else
  {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void InitializePOX()
{
  Serial.print("Initializing pulse oximeter..");

  // Initialize sensor
  if (!pox.begin()) {
    Serial.println("FAILED");
    for(;;);
  } else {
    Serial.println("SUCCESS");
  }

  // Configure sensor to use 7.6mA for LED drive
  pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
}

void loop()
{
  delay(1);  
}

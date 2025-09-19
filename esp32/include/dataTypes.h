struct SensorReading {
  float heartRate;
  float spo2;
  float bodyTemp;
  unsigned long timestamp;
  bool isValid;
};

struct NetworkData {
  SensorReading readings[10];
  int count;
};

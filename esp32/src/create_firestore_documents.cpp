#include <config.h>
#include <firebase.h>
#include <types.h>
#include <vitals.h>

// Overloads for Document
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

// Overloads for MapValue
void addField(Values::MapValue &map, const String &key, const String &value) {
  map.add(key, Values::Value(Values::StringValue(value)));
}

void addField(Values::MapValue &map, const String &key, int value) {
  map.add(key, Values::Value(Values::IntegerValue(value)));
}

void addField(Values::MapValue &map, const String &key, double value) {
  map.add(key, Values::Value(Values::DoubleValue(value)));
}

Document<Values::Value> createReadingDocument(const DeviceReading &reading) {
  Document<Values::Value> doc;

  // Basic info
  addField(doc, "id", reading.id);
  addField(doc, "timestamp", reading.timestamp);

  // Readings
  addField(doc, "heartRate", reading.vitalSigns.heartRate);
  addField(doc, "spo2", reading.vitalSigns.spo2);
  addField(doc, "bodyTemp", reading.vitalSigns.bodyTemp);

  Serial.println("Hr: " + String(reading.vitalSigns.heartRate));
  Serial.println("SpO2: " + String(reading.vitalSigns.spo2));
  Serial.println("Temp: " + String(reading.vitalSigns.bodyTemp));

  return doc;
}

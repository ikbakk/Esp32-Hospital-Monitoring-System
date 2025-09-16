#pragma once
#include <config.h>
#include <types.h>

String getTimestamp();
DeviceReading generateRandomReading();
void saveStringIfChanged(const char *key, const String &value);
void saveBoolIfChanged(const char *key, bool value);
void saveULongIfChanged(const char *key, unsigned long value);

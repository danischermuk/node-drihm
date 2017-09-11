#ifndef GENERALCONFIG_H_   /* Include guard */
#define GENERALCONFIG_H_

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <string.h>
#include "CRC.h"
#include "EEPROMAnything.h"

#define   GENERALCONFIG_VERSION       1

#define   BOARD_MODEL "ESP8266-01"

#define   GPIO_QTY    2

#define   GENERALCONFIG_EEPROM_ADDR   0

#define   DEVICE_NAME_MAX_LENGTH  16
#define   SSID_MAX_LENGTH         16
#define   PASS_MAX_LENGTH         16

#define   SSID_DEFAULT    "Sucred"
#define   PASS_DEFAULT    "ingeniero2012"

#define   DHCP_DEFAULT    false

#define   DEVICE_NAME_DEFAULT "WIFISWITCH"

const byte IP_DEFAULT[]           {10,  0,    0,    159};
const byte GATEWAY_DEFAULT[]      {10,  0,    0,    2};
const byte SUBNET_DEFAULT[]       {255, 255,  255,  0};

typedef struct GpioState_t
{
    byte      pinNumber;
    int      state;
};

typedef struct Wificonfig_t
{
    char      ssid[SSID_MAX_LENGTH];
    char      pass[PASS_MAX_LENGTH];
    byte      ip[4];
    byte      gateway[4];
    byte      subnet[4];
    bool      dhcp;
};

typedef struct GeneralConfig_t
{
      byte            Version = GENERALCONFIG_VERSION;
      unsigned long   id;
      Wificonfig_t    WifiConfig;
      char            DeviceName[DEVICE_NAME_MAX_LENGTH];
      // EL CRC TIENE QUE SER EL ULTIMO ATRIBUTO
      unsigned long   crc;
};

// DEFINO LA VARIABLE DE CONFIGURACION
GeneralConfig_t GeneralConfig;
// Defino la variable de estado de los pines
GpioState_t gpioState[GPIO_QTY] = {{0,0},{2,0}};


int gpioGetState (GpioState_t gpio)
{
  return gpio.state;
}

void gpioSetState (int gpio, bool state)
{
  gpioState[gpio].state = state;
  digitalWrite (gpioState[gpio].pinNumber, gpioState[gpio].state);
  Serial.println("gpioSetState()");
  Serial.print("GPIO: ");
  Serial.println(gpioState[gpio].pinNumber);
  Serial.print("State: ");
  Serial.println(gpioState[gpio].state);
}

void IPcpy (byte* dest, const byte* src)
{
  int i;  
  for (i=0;i<4;i++)
    dest[i] = src[i];
  return;
}

void GeneralConfig_Save (void)
{
  EEPROM_writeAnything(GENERALCONFIG_EEPROM_ADDR, GeneralConfig);
}


void GeneralConfig_LoadDefaults (void)
{
  // VERSION
  GeneralConfig.Version = GENERALCONFIG_VERSION;
  // ID
  GeneralConfig.id = ESP.getChipId();
  // CONFIGURACION WIFI
  strncpy(GeneralConfig.WifiConfig.ssid, SSID_DEFAULT, SSID_MAX_LENGTH);
  strncpy(GeneralConfig.WifiConfig.pass, PASS_DEFAULT, PASS_MAX_LENGTH);
  IPcpy(GeneralConfig.WifiConfig.ip,      IP_DEFAULT);
  IPcpy(GeneralConfig.WifiConfig.gateway, GATEWAY_DEFAULT);
  IPcpy(GeneralConfig.WifiConfig.subnet,  SUBNET_DEFAULT);
  GeneralConfig.WifiConfig.dhcp = DHCP_DEFAULT;
  // DEVICE NAME
  strncpy(GeneralConfig.DeviceName, DEVICE_NAME_DEFAULT, DEVICE_NAME_MAX_LENGTH);
  // CRC
  GeneralConfig.crc = crc((byte*)&GeneralConfig, sizeof(GeneralConfig) - sizeof(GeneralConfig.crc));
  // GUARDO EN EEPROM
  GeneralConfig_Save();
}

#endif // GENERALCONFIG_H_


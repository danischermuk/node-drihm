
/*
 *  This sketch demonstrates how to set up a simple HTTP-like server.
 *  The server will set a GPIO pin depending on the request
 *    http://server_ip/gpio/0 will set the GPIO2 low,
 *    http://server_ip/gpio/1 will set the GPIO2 high
 *  server_ip is the IP address of the ESP8266 module, will be 
 *  printed to Serial when the module is connected.
 */

#include <ESP8266WiFi.h>
#include <EEPROM.h>
#include <string.h>
#include <WiFiUdp.h>
#include "EEPROMAnything.h"
#include "CRC.h"
#include "GeneralConfig.h"
#include "Parsers.h"
#include "HTTPResponse.h"
#include "WifiSwitchAPI.h"

// #define DEBUG 1
#define HB_PERIOD 5000
// Create an instance of the server
// specify the port to listen on as an argument
WiFiServer server(80);

WiFiUDP Udp;
#define UDP_TX_PACKET_MAX_SIZE 128
char packetBuffer[UDP_TX_PACKET_MAX_SIZE]; //buffer to hold incoming packet,
unsigned int localUdpPort = 6789;
long lastHB = 0;
IPAddress ip;
char udpBuffer[255];



void setup() {

  Serial.begin(115200);
  delay(10);
  EEPROM.begin(512);
  // prepare GPIO2
  pinMode(2, OUTPUT);
  digitalWrite(2, 0);
  
  // Verificando la configuración de EEPROM
  EEPROM_readAnything(GENERALCONFIG_EEPROM_ADDR, GeneralConfig);
  int GeneralConfigCrc = crc((byte*)&GeneralConfig, sizeof(GeneralConfig) - sizeof(GeneralConfig.crc));
  if (GeneralConfigCrc == GeneralConfig.crc){
    Serial.println("Configuracion leida exitosamente");
  }
  else
  {
    Serial.println("Error al leer la configuracion. Cargando defaults...");
    GeneralConfig_LoadDefaults();
  }
#ifdef DEBUG
  // Para hacer modificaciones en el GeneralConfig a la fuerza
  GeneralConfig_LoadDefaults();
#endif

  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(GeneralConfig.WifiConfig.ssid);

  // Verifico la configuracion de la IP
  if (GeneralConfig.WifiConfig.dhcp == false)
  {
   WiFi.config(GeneralConfig.WifiConfig.ip, GeneralConfig.WifiConfig.gateway, GeneralConfig.WifiConfig.subnet); 
  }
  WiFi.begin(GeneralConfig.WifiConfig.ssid, GeneralConfig.WifiConfig.pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  // Start the server
  server.begin();
  Serial.println("Server started");
  // Print the IP address
  Serial.println(WiFi.localIP());

  Serial.println("ChipID");
  Serial.println(GeneralConfig.id);
 
  Udp.begin(localUdpPort);
  ip = WiFi.localIP();
  ip[3] = 255;

  Udp.beginPacket(ip, localUdpPort);
  Udp.write("Hello\n");
  Udp.endPacket();
  lastHB = millis();
}

void loop() {
  if((millis()-lastHB)>HB_PERIOD)
  {
    lastHB = millis();
    Udp.beginPacket(ip, localUdpPort);
    Udp.write("Hello\n");
    Udp.endPacket();
  }
  int packetSize = Udp.parsePacket();
  if(packetSize)
  {
      Serial.println("");
      Serial.print("Received packet of size ");
      Serial.println(packetSize);
      Serial.print("From ");
      IPAddress remote = Udp.remoteIP();
      for (int i =0; i < 4; i++) {
        Serial.print(remote[i], DEC);
        if (i < 3){
          Serial.print(".");
        }
      }
      Serial.print(", port ");
      Serial.println(Udp.remotePort());
      
      // read the packet into packetBufffer
      Udp.read(packetBuffer,UDP_TX_PACKET_MAX_SIZE);
      Serial.println("Contents:");
      
      Serial.println(packetBuffer);
  }
}


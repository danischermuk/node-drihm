
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
#include <ArduinoJson.h>

#include "EEPROMAnything.h"
#include "CRC.h"
#include "GeneralConfig.h"
#include "Parsers.h"
#include "HTTPResponse.h"
#include "WifiSwitchAPI.h"

#define DEBUG 1
#define HB_PERIOD 10000
// Create an instance of the server
// specify the port to listen on as an argument
WiFiServer server(80);

WiFiUDP Udp;
unsigned int localUdpPort = 6789;
long lastHB = 0;
IPAddress ip;
char myIpString[24];

int charArrayLength( char* array, int max) {
  int i=0;
  for (i=0 ; i<max ; i++)
    if (array[i] == '\0') return i;

  return i;
}




void setup() {
  Serial.begin(115200);
  delay(10);

  EEPROM.begin(512);
  // prepare GPIO2
  pinMode(2, OUTPUT);
  digitalWrite(2, 0);
  
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

  
  Udp.begin(GeneralConfig.ServerConfig.localPort);
    
    
  IPAddress myIp = WiFi.localIP();
  sprintf(myIpString, "%d.%d.%d.%d", myIp[0], myIp[1], myIp[2], myIp[3]);
}

void loop() {
//  byte ip[4];
//  int port;
//  IPcpy(ip,  GeneralConfig.ServerConfig.ip);
//  port = GeneralConfig.ServerConfig.port;
//  //Generate the JSON
//  StaticJsonBuffer<200> jsonBuffer;
//  char  message[200];
//  JsonObject& conf = jsonBuffer.createObject();
//  conf["id"]          = GeneralConfig.id;
//  conf["name"]        = GeneralConfig.DeviceName;
//  conf["type"]        = GeneralConfig.type;
//  conf["board"]       = GeneralConfig.board;
//  conf["version"]     = GeneralConfig.Version;  
//  conf["ip"]          = myIpString;
//  
//  conf.printTo(Serial);
//  Serial.println();
//  conf.printTo(message, sizeof(message));
//  
//  // transmit broadcast package
//  Udp.beginPacket(ip, port);
//  Udp.write(message);
//  Udp.endPacket();

 // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
  
  // Wait until the client sends some data
  while(!client.available()){
    delay(1);
  }

  static int val = 0;
  String content = "";
  // Read the first line of the request
  String req = client.readStringUntil('\r');
  // Ver si es un GET o un POST
  if (strncmp(req.c_str(), "GET", 3)==0)
  {
    Serial.println(req);
    // Es un GET, no necesito info adicional
    client.flush();
    // Procedo con la API
    // TODO: separar el manejo de la API
    if (req.indexOf("/gpio/0") != -1)
      val = 0;
    else if (req.indexOf("/gpio/1") != -1)
      val = 1;
    else if (req.indexOf("/gpio/toggle") != -1)
      val = (val)? 0:1;
    else {
      Serial.println("invalid request");
      client.stop();
      return;
    }
    // Set GPIO2 according to the request
    digitalWrite(2, val);
  }
  else if (strncmp(req.c_str(), "POST", 4)==0)
  {
    req = client.readString();
    content = ParseContent(&req);
    Serial.println(content);
    client.flush();
  }

  HTTPSendResponse (&client, OK_200, &content);
  client.flush();
 
}


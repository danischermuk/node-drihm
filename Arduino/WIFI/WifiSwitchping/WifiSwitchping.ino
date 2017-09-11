
/*
    This sketch demonstrates how to set up a simple HTTP-like server.
    The server will set a GPIO pin depending on the request
      http://server_ip/gpio/0 will set the GPIO2 low,
      http://server_ip/gpio/1 will set the GPIO2 high
    server_ip is the IP address of the ESP8266 module, will be
    printed to Serial when the module is connected.
*/

#include <ESP8266WiFi.h>
#include <EEPROM.h>
#include <string.h>
#include <WiFiUdp.h>
#include <QueueArray.h>
#include <ArduinoJson.h>


#include "EEPROMAnything.h"
#include "CRC.h"
#include "GeneralConfig.h"
#include "Parsers.h"
#include "HTTPResponse.h"
#include "WifiSwitchAPI.h"



#define DISCOVERY_PACKET "123abc456def789ghi"
// #define DEBUG 1
#define UPTIME_OVERFLOW         4294967295
#define HB_PERIOD               10000

#define SECS_PER_MIN  (60UL)
#define SECS_PER_HOUR (3600UL)
#define SECS_PER_DAY  (SECS_PER_HOUR * 24L)

/* Useful Macros for getting elapsed time */
#define numberOfSeconds(_time_) (_time_ % SECS_PER_MIN)  
#define numberOfMinutes(_time_) ((_time_ / SECS_PER_MIN) % SECS_PER_MIN) 
#define numberOfHours(_time_) (( _time_% SECS_PER_DAY) / SECS_PER_HOUR)
#define elapsedDays(_time_) ( _time_ / SECS_PER_DAY)  


char hostString[16] = {0};

// Create an instance of the server
// TODO: specify the port to listen on as an argument
WiFiServer server(80);
WiFiUDP Udp;
#define UDP_TX_PACKET_MAX_SIZE 128
char packetBuffer[UDP_TX_PACKET_MAX_SIZE]; //buffer to hold incoming packet,
char txBuffer[UDP_TX_PACKET_MAX_SIZE];
unsigned int localUdpPort = 6789;
IPAddress ip;

/*-------------------------------------------------------------------COLA Y EVENTOS-------------------------------------------------------------------*/
typedef enum EvtTypes_t {
  EVT_TICK,
  EVT_HB,
  EVT_TIMEOUT,
  EVT_DISCOVERY_PCKT,
  MAX_EVT
};

typedef struct Packet_t {
  IPAddress remoteIp;
  int       remotePort;
  char    content[UDP_TX_PACKET_MAX_SIZE];
};

typedef struct Evt_t {
  EvtTypes_t  Evt;
  void*       data;
  //Packet_t    packet;
};



Evt_t Evt = {EVT_TICK, NULL};

QueueArray <Evt_t> evtQueue;
/*-------------------------------------------------------------------STATE HANDLER-------------------------------------------------------------------*/
void (*state)(Evt_t *);
/*-------------------------------------------------------------------PACKET CRAFTERS-------------------------------------------------------------------*/

void packetInfoCraft(char * buff, int maxSize)
{
   
    //Generate the JSON
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& conf    = jsonBuffer.createObject();
    conf["id"]          = GeneralConfig.id;
    conf["name"]        = GeneralConfig.DeviceName;
    conf["version"]     = GeneralConfig.Version;  
    conf["ip"]          = WiFi.localIP().toString();

    
    conf.printTo(Serial);
    Serial.println();
    conf.printTo(buff, maxSize); 
}

/*-------------------------------------------------------------------TIMERS-------------------------------------------------------------------*/
#define TIMER_TICK  0 // Definido para tareas periodicas
#define TIMER_HB    1 // Definido para el HB
#define TIMER_1     2 // Definido para timeouts en general
#define TIMER_2     3 // Definido para timeouts en general
#define MAX_TIMERS  4 // Definido para timeouts en general

#define TICK_PERIOD 10 // 10mS

unsigned long timers [MAX_TIMERS];

void timersInit() {
  for (int i = 0; i < MAX_TIMERS; i++) {
    timerDissarm(i);
  }
  // Les hago un autostart
  timerLoad(TIMER_TICK, 1);
  //timerLoad(TIMER_HB, 1);
}

bool timerIsRunning(int timer) {
  return (timers[timer] != 0);
}

bool timerValidate(int timer) {
  return ((timer >= 0) && (timer < MAX_TIMERS));
}

void timerDissarm(int timer) {
  if (timerValidate(timer)) {
    timers[timer] = 0;
  }
}

void timerLoad(int timer, int ms) {
  if (timerValidate(timer)) {
    timers[timer] = millis() + ms;
  }
}

void timerLoop () {

  /* TIMER_TICK TIMER*/
  if (timerIsRunning(TIMER_TICK)) {
    if (timers[TIMER_TICK] <= millis()) {
      // Push Event to Queue
      evtQueue.enqueue({EVT_TICK, NULL});
      timerLoad(TIMER_TICK, TICK_PERIOD);
    }
  }

  /* TIMER_HB TIMER*/
  if (timerIsRunning(TIMER_HB)) {
    if (timers[TIMER_HB] <= millis()) {
      // Push Event to Queue
      evtQueue.enqueue({EVT_HB, NULL});
      timerLoad(TIMER_HB, HB_PERIOD);
    }
  }

  /* TIMER_1 TIMER*/
  if (timerIsRunning(TIMER_1)) {
    if (timers[TIMER_1] <= millis()) {
      //Dissarm Timer
      timerDissarm(TIMER_1);
      evtQueue.enqueue({EVT_TIMEOUT, NULL});
    }
  }

  /* TIMER_2 TIMER*/
  if (timerIsRunning(TIMER_2)) {
    if (timers[TIMER_2] <= millis()) {
      //Dissarm Timer
      timerDissarm(TIMER_2);
      evtQueue.enqueue({EVT_TIMEOUT, NULL});
    }
  }
}

/*-------------------------------------------------------------------UDP SERVER-------------------------------------------------------------------*/
void udpDiscoveryHandler () {
  int packetSize = Udp.parsePacket();
  if (packetSize)
  {
    // read the packet into packetBufffer
    Udp.read(packetBuffer, packetSize);
    packetBuffer[packetSize]='\0'; //Terminate the Char Array
    if ( strncmp(packetBuffer, DISCOVERY_PACKET, strlen(DISCOVERY_PACKET) ) == 0 ) {
      Serial.println("Paquete DISOCVERY");
      packetInfoCraft(txBuffer, UDP_TX_PACKET_MAX_SIZE);
      Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
      Udp.write(txBuffer);
      Udp.endPacket();
    }
  }
}

/*-------------------------------------------------------------------INIT STATE-------------------------------------------------------------------*/
void shInit (Evt_t *evt) {
  // Verificando la configuración de EEPROM
  
  if (GeneralConfig_Load())
    Serial.println("Configuracion leida exitosamente");
  else {
    Serial.println("Error al leer la configuracion. Cargando defaults...");
    GeneralConfig_LoadDefaults();
  }

#ifdef DEBUG
  // Para hacer modificaciones en el GeneralConfig a la fuerza
  Serial.println("Modo DEBUG, Cargando defaults...");
  GeneralConfig_LoadDefaults();
#endif
  sprintf(hostString, "ESP_%06X", ESP.getChipId());
  Serial.print("Hostname: ");
  Serial.println(hostString);
  WiFi.hostname(hostString);
  // Connect to WiFi network
  Serial.print("\nConnecting to ");
  Serial.println(GeneralConfig.WifiConfig.ssid);

  // Verifico la configuracion de la IP y me conecto a la red
  if (GeneralConfig.WifiConfig.dhcp == false)
  {
    WiFi.config(GeneralConfig.WifiConfig.ip, GeneralConfig.WifiConfig.gateway, GeneralConfig.WifiConfig.subnet);
  }
  WiFi.begin(GeneralConfig.WifiConfig.ssid, GeneralConfig.WifiConfig.pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected\n");

  // Start the server
  server.begin();
  Serial.println("Server started");
  // Print the IP address
  Serial.println(WiFi.localIP());
  // Print ChipID
  Serial.print("ChipID: ");
  Serial.println(GeneralConfig.id);
  // Inicializo el UDP
  Udp.begin(localUdpPort);
  // Genero la IP de Broadcast
  ip = WiFi.localIP();
  ip[3] = 255;
  // Hago un primer broadcast diferente al resto
  Udp.beginPacket(ip, localUdpPort);
  Udp.write("Hello World!\n");
  Udp.endPacket();
  state = shIdle;
}

/*-------------------------------------------------------------------IDLE STATE-------------------------------------------------------------------*/
void shIdle (Evt_t *evt) {
  // TODO: poner un swich-case para atajar los eventos
  if (evt->Evt == EVT_HB) {
    // Uptime
    static unsigned long last_uptime = 0;
    static unsigned char uptime_overflows = 0;
    if (millis() < last_uptime) ++uptime_overflows;
    last_uptime = millis();
    unsigned long uptime_seconds = uptime_overflows * (UPTIME_OVERFLOW / 1000) + (last_uptime / 1000);
    char buff[100];
    snprintf ( buff, sizeof(buff), "Uptime: %lu days, %lu hours, %lu minutes, %lu seconds", elapsedDays(uptime_seconds), numberOfHours(uptime_seconds), numberOfMinutes(uptime_seconds), numberOfSeconds(uptime_seconds));
        
    // HB Packet
    Udp.beginPacket(ip, localUdpPort);
    Udp.write(buff);    
    Udp.endPacket();
    Serial.println(buff);
  }
  else {

  }
}

/*-------------------------------------------------------------------SETUP-------------------------------------------------------------------*/
void setup() {
  //Initialize Serial and EEPROM
  Serial.begin(115200);
  EEPROM.begin(4096);
  timersInit();
  // prepare GPIO2
  pinMode(2, OUTPUT);
  digitalWrite(2, 0);
  state = shInit;
}
/*-------------------------------------------------------------------MAIN LOOP-------------------------------------------------------------------*/
void loop() {
  /*------------------CHEQUEO PAQUETES DE LA RED------------------------------------*/
  udpDiscoveryHandler();
  /*------------------CHEQUEO TIMERS------------------------------------*/
  timerLoop();
  /*------------------VERIFICO EVENTOS Y ACTIVO LA FSM------------------*/
  while (!evtQueue.isEmpty()) {
    Evt = evtQueue.dequeue();
    state(&Evt);
  }
}
/*-------------------------------------------------------------------END-------------------------------------------------------------------*/

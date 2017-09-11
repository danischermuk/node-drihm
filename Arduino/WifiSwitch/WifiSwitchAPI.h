#ifndef WIFISWITCHAPI_H_   /* Include guard */
#define WIFISWITCHAPI_H_

#include <ESP8266WiFi.h>
#include <string.h>
#include "EEPROMAnything.h"
#include "GeneralConfig.h"
#include "HTTPResponse.h"
#include "Parsers.h"

#define MEDIR_TIEMPOS 1

#ifdef MEDIR_TIEMPOS
long apitiempo=0;
#endif

#define GPIO_API_URL 	"/api/gpio/"
#define CONFIG_API_URL 	"/api/config/"
#define ID_API_URL		"/api/id"


void gpioAPI (HTTPRequestType_t reqType, String* reqURL, WiFiClient* cli)
{
	// Me paro al final de la URL de la API
	int gpio = -1;
	int state = -1;
	int index = sizeof(GPIO_API_URL)-1;
	// Si tengo un '/' es que tengo mas parametros
	// Parseo el numero de GPIO
	gpio = ParseIntFromStringAtIndex(reqURL, &index);
	if ((gpio >= 0)&&(gpio < GPIO_QTY))
	{

		// Si es un POST, busco la info del state
		if (reqType == HTTP_POST)
		{
			// Busco la info del state
			if (reqURL->charAt(index) == '/')
			{
				index++;
				state = ParseIntFromStringAtIndex(reqURL, &index);
				// Si es un state valido, lo configuro
				if ((state >= 0) && (state <= 1))
				{
					gpioSetState(gpio, state);
					// Contesto y salgo de la funcion
					String respContent = (String)"GPIO" + gpio + (String)" state: " + gpioGetState(gpioState[gpio]);
					HTTPSendResponse (cli, OK_200, &respContent);
					return;
				}
			}
			// Si no contesté antes es porque la peticion no es valida
			HTTPSendResponse (cli, BAD_REQUEST_400, NULL);	
			return;
		}
		else if (reqType == HTTP_GET)
		{
			String respContent = (String)"GPIO" + gpio + (String)" state: " + gpioGetState(gpioState[gpio]);
			HTTPSendResponse (cli, OK_200, &respContent);
			return;
		}
	}
	// Si llegué acá, es por una peticion errónea
	HTTPSendResponse (cli, BAD_REQUEST_400, NULL);
}

void configAPI (HTTPRequestType_t reqType, WiFiClient* cli)
{
	HTTPSendResponse (cli, OK_200, NULL);
  	cli->flush();
}

void idAPI (HTTPRequestType_t reqType, WiFiClient* cli)
{
	if (reqType == HTTP_GET)
	{
		String respContent = (String)"CHIP_ID: " + GeneralConfig.id;
		HTTPSendResponse (cli, OK_200, &respContent);
	}	
	else
	{
		HTTPSendResponse (cli, BAD_REQUEST_400, NULL);
	}

}

void APIProcess	(HTTPRequestType_t reqType, String* reqURL, WiFiClient* cli)
{
	if(reqURL->substring(0,sizeof(GPIO_API_URL)-1) == GPIO_API_URL)
		gpioAPI(reqType, reqURL, cli);
	else if (reqURL->substring(0,sizeof(CONFIG_API_URL)-1) == CONFIG_API_URL)
		configAPI(reqType, cli);
	else if (reqURL->substring(0,sizeof(ID_API_URL)-1) == ID_API_URL)
		idAPI(reqType, cli);
	else
		HTTPSendResponse(cli, BAD_REQUEST_400, NULL);
}


void APIHandle (WiFiClient* cli)
{
#ifdef MEDIR_TIEMPOS
  	apitiempo = millis();
#endif
  	HTTPRequestType_t reqType = REQ_TYPE_ERROR;
  	String content = "";
  	String reqURL = "";
  	// Read the first line of the request
  	String req = cli->readStringUntil('\r');
  	Serial.println(req);
#ifdef MEDIR_TIEMPOS
  Serial.print("client.readStringUntil: ");
  Serial.println(millis()-apitiempo);
#endif  	
  	// Ver si es un GET o un POST
#ifdef MEDIR_TIEMPOS
  	apitiempo=millis();
#endif
  	reqType = ParseHTTPRequestType (&req);
#ifdef MEDIR_TIEMPOS
  Serial.print("ParseHTTPRequestType: ");
  Serial.println(millis()-apitiempo);
  Serial.println(reqType);
#endif
	if (reqType == REQ_TYPE_ERROR)
  		return;
  	
  	// Parsear la URL del request
#ifdef MEDIR_TIEMPOS
  	apitiempo = millis();
#endif
  	reqURL = ParseRequestURL (&req);
#ifdef MEDIR_TIEMPOS
  Serial.print("ParseRequestURL: ");
  Serial.println(millis()-apitiempo);
#endif
  	// Procesar la solicutud
#ifdef MEDIR_TIEMPOS
  	apitiempo=millis();
#endif
  	APIProcess(reqType, &reqURL, cli);
#ifdef MEDIR_TIEMPOS
  Serial.print("APIProcess: ");
  Serial.println(millis()-apitiempo);
#endif
}

#endif // WIFISWITCHAPI_H_


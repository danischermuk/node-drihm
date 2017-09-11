#ifndef PARSERS_H_   /* Include guard */
#define PARSERS_H_

#include <Arduino.h>
#include <string.h>

#define toNumber(x) (x - '0')

typedef enum HTTPRequestType_t
{
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  HTTP_DELETE,
  REQ_TYPE_ERROR
};

int SkipSpacesAtIndex (String* str, int index)
{
  while (str->charAt(index) == ' ')
    index++;
  return index;
}


int ParseIntFromStringAtIndex (String* str, int* index)
{
  bool valid = false;
  int number = 0;
  // Sacar los espacios antes del numero
  *index = SkipSpacesAtIndex(str, *index);
  // Parsear los numeros que aparezcan a continuacion
  while (isdigit(str->charAt(*index)))
  {
    valid = true;
    number = number*10 + toNumber(str->charAt((*index)++));
  }
  if (valid)
    return number;
  else
    return -1;
}

String ParseContent (String* str)
{
  int index = 0;
  int contentLength = 0;
  String content = "";
  // Es un POST, necesito ver el contenido
  // TODO: Hacer el debido manejo de API y la respuesta
  index = str->indexOf("Content-Length:");
  if (index != -1)
  {
    index += sizeof("Content-Lemgth:");
    contentLength = ParseIntFromStringAtIndex(str, &index);
    if(contentLength != 0)
    {
      index = str->indexOf("\r\n\r\n");
      if (index != -1)
      {
        index += sizeof("\r\n\r\n");
        content = str->substring(index, index + contentLength);
      }
    }

  }
  return content;  
}

HTTPRequestType_t ParseHTTPRequestType (String* req)
{
  if (req->substring(0,3) == "GET")
    return HTTP_GET;
  else if (req->substring(0,4) == "POST")
    return HTTP_POST;
  else
    return REQ_TYPE_ERROR;
}

String ParseRequestURL (String* req)
{
  String reqURL = "";
  int from = 0;
  int to = 0;
  from = req->indexOf(" ");
  to = req->indexOf(" ", from+1);
  reqURL = req->substring(from+1, to);
  return reqURL;
}

#endif // PARSERS_H_


#include "EmonLib.h"             // Include Emon Library
#include <DHT.h>
#include <Wire.h>
#include <Time.h>
#include <SPI.h>         
#include <Ethernet.h>
#include <Event.h>
#include <Timer.h>
#include <SoftwareSerial.h>
#include <string.h>
#include <stdlib.h>

#define pwrPin 2
#define rstPin 3
#define latchPin 8 // ST_CP
#define clockPin 5 // SH_CP
#define dataPin 6  // DS
#define DHTPIN 7
#define DHTTYPE DHT22

//holders for infromation you're going to pass to shifting function
byte dataOne;
byte dataTwo;
byte dataArrayOne[10];
byte dataArrayTwo[10];

EnergyMonitor emon;             // Create an instance

Timer t;
byte mac[] = { 0xDE, 0xAD, 0xEB, 0xEF, 0xEF, 0xDE };
const int updateThingSpeakInterval = 15 * 1000;      // Time interval in milliseconds to update ThingSpeak (number of seconds * 1000 = interval)

// Variable Setup
long lastConnectionTime = 0; 
boolean lastConnected = false;
uint8_t failedCounter = 0;
uint8_t resetCounter = 0;

// Initialize Arduino Ethernet Client
EthernetClient client;

long unsigned int intervalGetCommand = 15000;
SoftwareSerial Terminal(4, 9);
char buffer[64]; // buffer array for data recieve over serial port
uint8_t count=0; // counter for buffer array 
float power, voltage, current, apower, powerfactor, temp, hum;
uint8_t acdetect;
char smeasure[10];
unsigned int ADCValue;
double Voltage;
double Vcc;
uint8_t state=0; // state of SimCom sequence

DHT dht(DHTPIN, DHTTYPE);

#include <avr/pgmspace.h>
prog_char cgatt[] PROGMEM = "AT+CGATT=1";
prog_char cstt[] PROGMEM = "AT+CSTT=\"3gprs\",\"3gprs\",\"3gprs\"";
prog_char ciicr[] PROGMEM = "AT+CIICR";
prog_char cifsr[] PROGMEM = "AT+CIFSR";
prog_char cdnscfg[] PROGMEM = "AT+CDNSCFG=\"8.8.8.8\",\"8.8.4.4\"";
prog_char sapbrcon[] PROGMEM = "AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"";
prog_char sapbrapn[] PROGMEM = "AT+SAPBR=3,1,\"APN\",\"3gprs\"";   
prog_char sapbr[] PROGMEM = "AT+SAPBR=1,1";
prog_char httpinit[] PROGMEM = "AT+HTTPINIT";
prog_char httppara[] PROGMEM = "AT+HTTPPARA=\"URL\",\"api.thingspeak.com/update\"";
prog_char httpdata[] PROGMEM = "AT+HTTPDATA=";
prog_char httpaction[] PROGMEM = "AT+HTTPACTION=1";
prog_char tspost[] PROGMEM = "POST /update HTTP/1.1\n";
prog_char tshost[] PROGMEM = "Host: api.thingspeak.com\n";
prog_char tsconn[] PROGMEM = "Connection: close\n";
prog_char tscont[] PROGMEM = "Content-Type: application/x-www-form-urlencoded\n";
prog_char tscontlen[] PROGMEM = "Content-Length: ";
prog_char httpapi[] PROGMEM = "AT+HTTPPARA=\"X-THINGSPEAKAPIKEY\",";
prog_char httpcid[] PROGMEM = "AT+HTTPPARA=\"CID\",1";
prog_char httpterm[] PROGMEM = "AT+HTTPTERM";
prog_char key[] PROGMEM = "key=";
prog_char field1[] PROGMEM = "&field1=";
prog_char field2[] PROGMEM = "&field2=";
prog_char field3[] PROGMEM = "&field3=";
prog_char field4[] PROGMEM = "&field4=";
prog_char apikey[] PROGMEM = "J92QL2G3I6YEW1FB"; // Enermon 1
prog_char tsaddress[] PROGMEM = "api.thingspeak.com";
prog_char field5[] PROGMEM = "&field5=";
prog_char field6[] PROGMEM = "&field6=";
prog_char field7[] PROGMEM = "&field7=";
prog_char field8[] PROGMEM = "&field8=";

PROGMEM const char *string_table[] = 
{ cgatt, cstt, ciicr, cifsr, cdnscfg, sapbrcon, sapbrapn, sapbr, httpinit, httppara, httpdata, httpaction, tspost, tshost, tsconn, tscont, tscontlen, httpapi, httpcid, httpterm, key, field1, field2, field3, field4, apikey, tsaddress, field5, field6, field7, field8 };

char progbuffer[65];    // make sure this is large enough for the largest string it must hold

char* deblank(char* input)                                         
{
  uint8_t i,j;
  char *output=input;
  for (i = 0, j = 0; i<strlen(input); i++,j++)          
  {
      if (input[i]!=' ')                           
          output[j]=input[i];                     
      else
          j--;                                     
  }
  output[j]=0;
  return output;
}

long readVcc() {
  long result;
  // Read 1.1V reference against AVcc
  ADMUX = _BV(REFS0) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
  delay(2); // Wait for Vref to settle
  ADCSRA |= _BV(ADSC); // Convert
  while (bit_is_set(ADCSRA,ADSC));
  result = ADCL;
  result |= ADCH<<8;
  result = 1125300L / result; // Back-calculate AVcc in mV
  return result;
}

void setupPin()
{
  pinMode(rstPin, OUTPUT);  
  digitalWrite(rstPin, LOW);
  pinMode(latchPin, OUTPUT);
}

void setupSimCom() {
  pinMode(pwrPin, OUTPUT);
  digitalWrite(pwrPin, LOW);
  delay(1000);
  digitalWrite(pwrPin, HIGH);
  delay(1500);
  digitalWrite(pwrPin, LOW);
  delay(2500);
}

boolean waitOk() {
  bool isOk = false;
  bool isAll = false;
  uint8_t i = 0;
  while ( (!isOk) && (!isAll) ) {
    if ( buffer[i] == 'O' ) {
      if (( buffer[i+1] == 'K' ) && ( buffer[i+2] == '\r' )) { // OK response
        isOk = true;
      }
    }
    if (i == 63) {
      isAll = true;
    }
    i++;
  }
  if (isOk) return true;
  if (isAll) return false;
}

boolean waitDownload() {
  bool isDownload = false;
  bool isAll = false;
  uint8_t i = 0;
  while ( (!isDownload) && (!isAll) ) {
    if ( buffer[i] == 'D' ) {
      if (( buffer[i+1] == 'O' ) && ( buffer[i+2] == 'W' ) && ( buffer[i+3] == 'N' ) && ( buffer[i+4] == 'L' )) { // DOWNLOAD response
        isDownload = true;
      }
    }
    if (i == 63) {
      isAll = true;
    }
    i++;
  }
  if (isDownload) return true;
  if (isAll) return false;
}

boolean waitIp() {
  bool isAll = false;
  uint8_t numDot = 0;
  uint8_t i = 0;
  while ( (numDot<3) && (!isAll) ) {
    if ( buffer[i] == '.' ) {
      numDot++;      
    }
    if (i == 63) {
      isAll = true;
    }
    i++;
  }
  if (numDot == 3) return true;
  if (isAll) return false;
}

void initialiseADC() {
  Vcc = readVcc()/1000.0;
//  Terminal.print("Vcc: ");
//  Terminal.println(Vcc);  
  analogReference(DEFAULT);
  delay(10);
}

void initialiseEthernet() {
  
  client.stop();
  if (Ethernet.begin(mac) == 0) {
    Terminal.println("Failed using DHCP");
  }
  else { 
    Terminal.println("DHCP Ok"); 
  }
  delay(1000);
}

void initialiseGPRS() {  
  setupSimCom();
  uint8_t incomingByte = 0;
  boolean timeout = false;
  unsigned long time;
  
  while (state == 0) {
    Serial.println("AT");
    delay(100);
    timeout = false;
    time = millis();
    while( (!Serial.available()) && (!timeout) ) {
      if ( (millis() - time) > 3000 ) {
        timeout = true;
      }
    } // wait for response
    while(Serial.available()) // reading data into char array 
    {
      incomingByte=Serial.read(); // writing data into array      
      buffer[count++]=incomingByte; // writing data into array
//      Terminal.write(incomingByte);
      if(count == 64)break;
    }
    if (waitOk()) {
//      Terminal.println("OK");
      state=2;
    }
    else {
      state=0;
      setupSimCom();
//      Terminal.println("NA");
    }
    clearBufferArray();              // call clearBufferArray function to clear the storaged data from the array
    count = 0;                       // set counter of while loop to zero 
  }

  while (state == 2) {
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[0])));
    Serial.println(progbuffer);
    delay(500);
    timeout = false;
    time = millis();
    while( (!Serial.available()) && (!timeout) ) {
      if ( (millis() - time) > 3000 ) {
        timeout = true;
      }
    } // wait for response
    while(Serial.available()) // reading data into char array 
    {
      incomingByte=Serial.read(); // writing data into array      
      buffer[count++]=incomingByte; // writing data into array
//      Terminal.write(incomingByte);
      if(count == 64)break;
    }
    if (waitOk()) {
      state=3;
//      Terminal.println("CG");
//      Terminal.println("AT CGATT finished");
    }
    else {
      state=2;
//      Terminal.println("NA"); 
//      Terminal.println("AT CGATT restarted");
    }
    clearBufferArray();              // call clearBufferArray function to clear the storaged data from the array
    count = 0;                       // set counter of while loop to zero 
  }

  while (state == 3) {
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[1])));
    Serial.println(progbuffer);
    delay(100);
    timeout = false;
    time = millis();
    while( (!Serial.available()) && (!timeout) ) {
      if ( (millis() - time) > 3000 ) {
        timeout = true;
      }
    } // wait for response
    while(Serial.available())          // reading data into char array 
    {
      incomingByte=Serial.read(); // writing data into array      
      buffer[count++]=incomingByte; // writing data into array
//      Terminal.write(incomingByte);
      if(count == 64)break;      
    }
    if (waitOk()) {
      state=4;
//      Terminal.println("AT CSTT finished");      
    }
    else {
      state=3;
//      Terminal.println("AT CSTT restarted");      
    }
    clearBufferArray();              // call clearBufferArray function to clear the storaged data from the array
    count = 0;                       // set counter of while loop to zero
  }  

  while (state == 4) {
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[2])));
    Serial.println(progbuffer);
    delay(200);
    timeout = false;
    time = millis();
    while( (!Serial.available()) && (!timeout) ) {
      if ( (millis() - time) > 3000 ) {
        timeout = true;
      }
    } // wait for response
    while(Serial.available())          // reading data into char array 
    {
      incomingByte=Serial.read(); // writing data into array      
      buffer[count++]=incomingByte; // writing data into array
//      Terminal.write(incomingByte);
      if(count == 12) break;
    }
    if (waitOk()) {
      state=5;
//      Terminal.println("CIICR");
//      Terminal.println("AT CIICR finished");      
    }
    else {
      state=4;
//      Terminal.println("AT CIICR restarted");      
    }
    clearBufferArray();              // call clearBufferArray function to clear the storaged data from the array
    count = 0;                       // set counter of while loop to zero
  }

  while (state == 5) {
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[3])));
    Serial.println(progbuffer);
    delay(100);
    timeout = false;
    time = millis();
    while( (!Serial.available()) && (!timeout) ) {
      if ( (millis() - time) > 3000 ) {
        timeout = true;
      }
    } // wait for response
    while(Serial.available())          // reading data into char array 
    {
      buffer[count++]=Serial.read();     // writing data into array
      if(count == 64)break;
    }
    if (waitIp()) {
      state=6;
//      Terminal.println("CIFSR");
//      Terminal.println("AT CIFSR finished");      
    }
    else {
      state=5;
//      Terminal.println("AT CIFSR restarted");      
    }
    clearBufferArray();              // call clearBufferArray function to clear the storaged data from the array
    count = 0;                       // set counter of while loop to zero
  }

  while (state == 6) {
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[4])));
    Serial.println(progbuffer);
    delay(100);
    timeout = false;
    time = millis();
    while( (!Serial.available()) && (!timeout) ) {
      if ( (millis() - time) > 3000 ) {
        timeout = true;
      }
    } // wait for response
    while(Serial.available())          // reading data into char array 
    {
      buffer[count++]=Serial.read();     // writing data into array
      if(count == 64)break;
    }
    if (waitOk()) {
      state=7;
//      Terminal.println("CDNS");
//      Terminal.println("AT CDNSCFG finished");      
    }
    else {
      state=6;
//      Terminal.println("AT CDNSCFG restarted");      
    }
    clearBufferArray();              // call clearBufferArray function to clear the storaged data from the array
    count = 0;                       // set counter of while loop to zero
  }

//  Terminal.println("SAPBR");

  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[5])));
  Serial.println(progbuffer);
  delay(2000);

//  Terminal.println("SAPBR 1");

  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[6])));
  Serial.println(progbuffer);
  delay(5000);

//  Terminal.println("SAPBR 2");

  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[7])));
  Serial.println(progbuffer);
  delay(4000);
  if (Serial.available())              // if date is comming from softwareserial port ==> data is comming from PC
  {
//    Terminal.println("SAP");
    while(Serial.available())          // reading data into char array 
    {
      buffer[count++]=Serial.read();     // writing data into array
      if(count == 64)break;
    }
    clearBufferArray();              // call clearBufferArray function to clear the storaged data from the array
    count = 0;                       // set counter of while loop to zero 
  }
//  Terminal.println("Sim");
}

void setup()
{
  Terminal.begin(115200);           // the PC Terminal baud rate
  Serial.begin(57600);             // the GPRS serial baud rate.  
  Terminal.println("Hi SR");
  initialiseEthernet();
  initialiseGPRS();
  initialiseADC();
  setupPin();
  dht.begin();
  emon.voltage(1, 451.813, 2.0);  // Voltage: input pin, calibration, phase_shift. 2,0 is still not correct
  emon.current(0, 111.1);  // Current: input pin, calibration.  
  t.every(intervalGetCommand, httpGetCommand, 0);
//  Terminal.println("");
}

// send data periodically - try using ethernet. if failed, send using GPRS
void httpGetCommand(void* context) { 
  uint8_t incomingByte = 0;
  emon.calcVI(20,2000);

  Terminal.println();  
  Terminal.println(emon.Vrms);
  Terminal.println(emon.Irms);  
  Terminal.println(emon.realPower);
  Terminal.println(emon.apparentPower);
  Terminal.println(emon.powerFactor);
  Terminal.println();
  
  String tsData = progbuffer;
  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[21])));
  tsData += progbuffer;
  voltage = emon.Vrms;
  dtostrf(voltage,6,2,smeasure);
  tsData += deblank(smeasure);
  
  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[22])));
  tsData += progbuffer;
  current = emon.Irms;
  dtostrf(current,6,2,smeasure);
  tsData += deblank(smeasure);
  
  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[23])));
  tsData += progbuffer;
  power = emon.realPower;
  dtostrf(power,6,2,smeasure);
  tsData += deblank(smeasure);

  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[24])));
  tsData += progbuffer;
  apower = emon.apparentPower;
  dtostrf(apower,6,2,smeasure);
  tsData += deblank(smeasure);  

  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[27])));
  tsData += progbuffer;
  powerfactor = emon.powerFactor;
  dtostrf(powerfactor,6,2,smeasure);
  tsData += deblank(smeasure);

  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[28])));
  tsData += progbuffer;
  temp = dht.readTemperature();
  dtostrf(temp,6,2,smeasure);
  tsData += deblank(smeasure);

  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[29])));
  tsData += progbuffer;
  hum = dht.readHumidity();
  dtostrf(hum,6,2,smeasure);
  tsData += deblank(smeasure);
  
//  Terminal.println("Sending...");
  // Disconnect from ThingSpeak
  if (!client.connected() && lastConnected)
  {
//    Terminal.print("Stop");
    client.stop();
  }
  
  // Update ThingSpeak
  if(!client.connected())
  {
    sendUsingEthernet(tsData);
  }
  
  if (failedCounter > 1 ) {
    sendUsingGPRS(tsData);  // if ethernet restarted 3 times, send using GPRS  
    resetCounter++;
    initialiseEthernet();
  }
  lastConnected = client.connected();
  client.stop();
  
  if ( resetCounter > 3 ) {
    sendUsingGPRS(tsData);  // if ethernet restarted 3 times, send using GPRS  
  }
}

void loop()
{
  t.update();
}

void clearBufferArray()              // function to clear buffer array
{
  for (uint8_t i=0; i<count;i++)
  { 
    buffer[i]=NULL;
  }                  // clear all index of array with command NULL
}

uint8_t sendUsingEthernet(String tsData)
{
//  Terminal.println("Try key");
  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[26]))); // ThingSpeak address
  if (client.connect(progbuffer, 80))
  {
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[12]))); // POST
    client.print(progbuffer);
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[13]))); // Host
    client.print(progbuffer);
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[14]))); // Conn
    client.print(progbuffer);
//    client.print("X-THINGSPEAKAPIKEY: "+writeAPIKey+"\n");
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[15]))); // Cont
    client.print(progbuffer);
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[16]))); // ContLen
    client.print(progbuffer);
    client.print(tsData.length());
    client.print("\n\n");
    client.print(tsData);
    lastConnectionTime = millis();
    
    if (client.connected())
    {
//      Terminal.println("TS Ok");
      failedCounter = 0;
      resetCounter = 0;
    }
    else
    {
//      Terminal.println("TS Fail");
      failedCounter++;
    }    
  }
  else
  {
    failedCounter++;
    lastConnectionTime = millis(); 
  }
}

uint8_t sendUsingGPRS (String tsData) {
  uint8_t incomingByte = 0;
  boolean timeout = false;
  unsigned long time;
  
  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[8]))); // HTTPINIT
  Serial.println(progbuffer);
  delay(2000);

  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[9]))); // HTTPPARA URL
  Serial.println(progbuffer);
  delay(1000);
  if (Serial.available())
  {
    while(Serial.available())
    {
      buffer[count++]=Serial.read();
      if(count == 64)break;
    }
    clearBufferArray();
    count = 0;
  }

  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[18])));
  Serial.println(progbuffer);
  delay(1000);
  if (Serial.available())
  {
    while(Serial.available())
    {
      buffer[count++]=Serial.read();
      if(count == 64)break;
    }
    clearBufferArray();
    count = 0;
  }

  while (state == 7) {
    strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[10]))); // HTTPDATA
    Serial.print(progbuffer); //submit the request;
    Serial.print(tsData.length());
    Serial.println(",10000");
 
//    Terminal.print(progbuffer);
//    Terminal.print(tsData.length());
//    Terminal.println(",10000");
    
    delay(100);
    timeout = false;
    time = millis();
    while( (!Serial.available()) && (!timeout) ) {
      if ( (millis() - time) > 3000 ) {
        timeout = true;
      }
    } // wait for response
    while(Serial.available()) // reading data into char array 
    {
      incomingByte=Serial.read(); // writing data into array      
      buffer[count++]=incomingByte; // writing data into array
//      Terminal.write(incomingByte);
      if(count == 64)break;
    }
    if (waitDownload()) {
//      Terminal.println("Dl Ok");
      state=8;      
    }
    else {
//      Terminal.println("Dl Rst");
      state=7;
    }
    clearBufferArray();
    count = 0; 
  }

  while (state == 8) {
    Serial.println(tsData);
    timeout = false;
    time = millis();
    while( (!Serial.available()) && (!timeout) ) {
      if ( (millis() - time) > 3000 ) {
        timeout = true;
      }
    } // wait for response
    while(Serial.available())
    {
      incomingByte=Serial.read();
      buffer[count++]=incomingByte;
//      Terminal.write(incomingByte);
      if(count == 64)break;
    }
    if (waitOk()) {
//      Terminal.println("Dt Ok");
      state=9;
    }
    else {
//      Terminal.println("Dt Rst");
      state=8;
    }
    clearBufferArray();
    count = 0;
  }
  
//  Terminal.println("Ac");    
  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[11]))); // HTTPACTION
  Serial.println(progbuffer); //submit the request
  delay(10000);
//  Terminal.println("Ac2");
  if (Serial.available())
  {
    while(Serial.available()) 
    {
      incomingByte=Serial.read();
      buffer[count++]=incomingByte;
      if(count == 64)break;
    }
    clearBufferArray();
    count = 0;
  }
//  Terminal.println("Te");  
//  strcpy_P(progbuffer, (char*)pgm_read_word(&(string_table[19]))); // HTTPTERM
//  Serial.println(progbuffer);
//  delay(1000);
//  if (Serial.available())
//  {
//    while(Serial.available())
//    {
//      incomingByte=Serial.read();
//      buffer[count++]=incomingByte;
//      if(count == 64)break;
//    }
//    clearBufferArray();
//    count = 0;
//  }
  
  state = 7;
//  Terminal.println("GPRS");  
  return 1;
}

void shiftOut(int myDataPin, int myClockPin, byte myDataOut) {
  // This shifts 8 bits out MSB first, 
  // on the rising edge of the clock,
  // clock idles low

  //internal function setup
  int i=0;
  int pinState;
  pinMode(myClockPin, OUTPUT);
  pinMode(myDataPin, OUTPUT);

  //clear everything out just in case to
  //prepare shift register for bit shifting
  digitalWrite(myDataPin, 0);
  digitalWrite(myClockPin, 0);

  //for each bit in the byte myDataOut�
  //NOTICE THAT WE ARE COUNTING DOWN in our for loop
  //This means that %00000001 or "1" will go through such
  //that it will be pin Q0 that lights. 
  for (i=7; i>=0; i--)  {
    digitalWrite(myClockPin, 0);

    //if the value passed to myDataOut and a bitmask result 
    // true then... so if we are at i=6 and our value is
    // %11010100 it would the code compares it to %01000000 
    // and proceeds to set pinState to 1.
    if ( myDataOut & (1<<i) ) {
      pinState= 1;
    }
    else {	
      pinState= 0;
    }

    //Sets the pin to HIGH or LOW depending on pinState
    digitalWrite(myDataPin, pinState);
    //register shifts bits on upstroke of clock pin  
    digitalWrite(myClockPin, 1);
    //zero the data pin after shift to prevent bleed through
    digitalWrite(myDataPin, 0);
  }

  //stop shifting
  digitalWrite(myClockPin, 0);
}


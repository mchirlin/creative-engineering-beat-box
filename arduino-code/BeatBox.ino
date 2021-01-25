#include <ESP8266WiFi.h>        // Include the Wi-Fi library

#include <ArduinoJson.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>

#define USE_SERIAL Serial

SocketIOclient socketIO;

const char* ssid     = "XXXXX";     // The SSID (name) of the Wi-Fi network you want to connect to
const char* password = "XXXXX";     // The password of the Wi-Fi network
const int NOTE_TRIGGER_PIN = D0;
const int NOTE_ECHO_PIN = D1;

const int PLAY_TRIGGER_PIN = D6;
const int PLAY_ECHO_PIN = D5; 

const int INSTRUMENT_PIN = D3;

const int RED_LED_PIN = D7;
const int YELLOW_LED_PIN = D8;
const int GREEN_LED_PIN = 9;

const int POT_PIN = A0;

unsigned long noteTimestamp, instrumentTimestamp;
int noteDistance, playDistance;
int buttonPress, intrumentPress;

const int DISTANCE_COUNT = 4;
int distanceIndex = 0;
int noteDistances[DISTANCE_COUNT] = {0,0,0,0};

char* note = "A";
int octave = 2;

int instrumentIndex = 0;
const int NUMBER_OF_INSTRUMENTS = 9;
const int MAX_SIZE = 15;

char instruments [NUMBER_OF_INSTRUMENTS] [MAX_SIZE] = {
 { "piano" },
 { "violin" },
 { "bassoon" },
 { "guitarAcoustic" },
 { "guitarElectric" },
 { "flute" },
 { "saxophone" },
 { "trumpet" },
 { "drum" }
};

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            digitalWrite(GREEN_LED_PIN, 0);
            digitalWrite(YELLOW_LED_PIN, 1);
            
            USE_SERIAL.printf("[IOc] Disconnected!\n");
            break;
        case sIOtype_CONNECT:
            //USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

            digitalWrite(YELLOW_LED_PIN, 0);
            digitalWrite(GREEN_LED_PIN, 1);
            
            socketIO.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_EVENT:
            USE_SERIAL.printf("[IOc] get event: %s\n", payload);
            break;
        case sIOtype_ACK:
            USE_SERIAL.printf("[IOc] get ack: %u\n", length);
            hexdump(payload, length);
            break;
        case sIOtype_ERROR:
            USE_SERIAL.printf("[IOc] get error: %u\n", length);
            hexdump(payload, length);
            break;
        case sIOtype_BINARY_EVENT:
            USE_SERIAL.printf("[IOc] get binary: %u\n", length);
            hexdump(payload, length);
            break;
        case sIOtype_BINARY_ACK:
            USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
            hexdump(payload, length);
            break;
    }
}

void setup() {
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(YELLOW_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(POT_PIN, INPUT);

  digitalWrite(RED_LED_PIN, 1);
  
  USE_SERIAL.begin(115200);         // Start the Serial communication to send messages to the computer
  delay(10);
  USE_SERIAL.println('\n');

  USE_SERIAL.print("Connecting to ");
  
  WiFi.begin(ssid, password);             // Connect to the network
  USE_SERIAL.print(ssid); 
  USE_SERIAL.println(" ...");

  int i = 0;
  while (WiFi.status() != WL_CONNECTED) { // Wait for the Wi-Fi to connect
    delay(1000);
    USE_SERIAL.print(++i); Serial.print(' ');
  }

  USE_SERIAL.println('\n');
  USE_SERIAL.println("Connection established!");
  digitalWrite(RED_LED_PIN, 0);
  digitalWrite(YELLOW_LED_PIN, 1);
   
  USE_SERIAL.print("IP address:\t");
  USE_SERIAL.println(WiFi.localIP());         // Send the IP address of the ESP8266 to the computer

  USE_SERIAL.println("Connecting to WebSocket server");

  socketIO.begin("XXXX", 4001);  //TODO The IP of the server running the websockets
  socketIO.onEvent(socketIOEvent);
  
  pinMode(NOTE_TRIGGER_PIN, OUTPUT);
  pinMode(NOTE_ECHO_PIN, INPUT);
  
  pinMode(PLAY_TRIGGER_PIN, OUTPUT);
  pinMode(PLAY_ECHO_PIN, INPUT);
  pinMode(INSTRUMENT_PIN, INPUT);
}

unsigned long messageTimestamp = 0;

int loopDelay = 50;

void loop() {
  socketIO.loop();
  
  unsigned long now = millis();

  if(now > (messageTimestamp + loopDelay)) {
    // Note ultrasonic sensor
    noteDistance = sendPulse(NOTE_TRIGGER_PIN, NOTE_ECHO_PIN);
    setNote(noteDistance);

    // Play ultrasonic sensor
    playDistance = sendPulse(PLAY_TRIGGER_PIN, PLAY_ECHO_PIN);
    intrumentPress = !digitalRead(INSTRUMENT_PIN);

    // Pot sensor
    setOctave(analogRead(POT_PIN));
    
    messageTimestamp = now;

    if (intrumentPress && now > instrumentTimestamp) changeInstrument();
    if (playDistance < 10 && now > noteTimestamp) sendNote(note, octave);  
  }
}

long sendPulse(int triggerPin, int echoPin) {
  long distance;
  
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  
  //Calculate the distance (in cm) based on the speed of sound.
  distance = duration/58.2;
  return distance;
}

void setNote(long distance) {
  if (distance < 80) {
    noteDistances[distanceIndex] = distance;
    if (distanceIndex == DISTANCE_COUNT - 1) distanceIndex = 0;
    else distanceIndex += 1;
  }

  float ave = average(noteDistances, DISTANCE_COUNT);
  USE_SERIAL.println(ave);
  
  // Between 1 and Range
  if (ave > 0 && ave < 10) {
    note = "C";
  } else if (ave >= 10 && ave < 20) {
    note = "D";
  } else if (ave >= 20 && ave < 30) {
    note = "E";
  } else if (ave >= 30 && ave < 40) {
    note = "F";
  } else if (ave >= 40 && ave < 50) {
    note = "G";
  } else if (ave >= 50 && ave < 60) {
    note = "A";
  } else if (ave >= 60 && ave < 70) {
    note = "B";
  } else if (ave >= 70 && ave < 80) {
    note = "C";
  }
}

void setOctave(float voltage) {
  float result = voltage / 150;

  octave = ceil(result);
}

int debounce = 200;
void sendNote(char* note, int octave) {
 
  noteTimestamp = messageTimestamp + debounce;

  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();
      
  // add event name
  array.add("PlayNote");

  // add payload (parameters) for the event
  JsonObject param1 = array.createNestedObject();
  param1["instrument"] = instruments[instrumentIndex];
  
  char noteBuffer[10];
  sprintf(noteBuffer, "%s%i", note, octave);
  
  USE_SERIAL.println(noteBuffer);
  param1["note"] = noteBuffer;

  // JSON to String (serializion)
  String output;
  serializeJson(doc, output);

  // Send event        
  socketIO.sendEVENT(output);

  // Print JSON for debugging
  USE_SERIAL.println(output);
}

void changeInstrument() {
  instrumentTimestamp = messageTimestamp + debounce;
  
  if (instrumentIndex == NUMBER_OF_INSTRUMENTS - 1) {
    instrumentIndex = 0;
  } else {
    instrumentIndex += 1;
  }

  USE_SERIAL.println(instruments[instrumentIndex]);
}

float average(int * array, int len) {
  long sum = 0L ;  // sum will be larger than an item, long for safety.
  for (int i = 0 ; i < len ; i++)
    sum += array [i] ;
  return  ((float) sum) / len ;  // average will be fractional, so float may be appropriate.
}

#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino.h>
#include <ArduinoJson.h>

#define SSID "wifi"
#define PASSWORD "mypasswd"
#define supabaseUrl "https://ntfqzuqtaewkcyeyokcr.supabase.co"
#define supabaseKey "sb_publishable_XLA9VY1DxFFxwyOKxeXQWg_5wPUZzVk"
#define tableName "irrigation"
#define RX2_PIN 16
#define TX2_PIN 17
#define CHECK_INTERVAL_MS 5000UL

char receivedData[60];
int my_index = 0;
bool cmd = false;

bool          pumpActive     = false;
unsigned long pumpStartMs    = 0;
unsigned long pumpDurationMs = 0;
unsigned long lastCheckMs    = 0;

void getDataFromSTM() {
  while (Serial2.available()) {
    char c = Serial2.read();
    if (c == '\n') {
      receivedData[my_index] = '\0';
      Serial.println("==DataFromSTM===============================");
      Serial.print("Received: ");
      Serial.println(receivedData);
      int index = -1;
      for (int i = 0; receivedData[i] != '\0'; i++) {
        if (receivedData[i] == 'i') { index = i; break; }
      }
      if (index != -1) {
        char soilValue = receivedData[index + 4];
        char rainValue = receivedData[index + 14];
        sendData((soilValue - '0'), (rainValue - '0'), false);
      }
      delay(2000);
      my_index = 0;
    } else {
      if (my_index < sizeof(receivedData) - 1)
        receivedData[my_index++] = c;
    }
  }
}

void sendData(int soil_moisture, int rain, bool cmd) {
  if (WiFi.status() != WL_CONNECTED) {
    while (!WiFi.reconnect()) { delay(500); }
  }
  StaticJsonDocument<200> jsonDoc;
  if (cmd == true) {
    jsonDoc["command"] = 0;
    jsonDoc["duration"] = 0;
  } else {
    jsonDoc["soil_moisture"] = soil_moisture;
    jsonDoc["rain"] = rain;
  }
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  HTTPClient http;
  String endpoint = String(supabaseUrl) + "/rest/v1/" + tableName + "?id=eq.1";
  http.begin(endpoint);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", "Bearer " + String(supabaseKey));
  http.addHeader("Prefer", "return=representation");
  int httpResponseCode = http.PATCH(jsonString);
  Serial.println("Sending to Dashboard...");
    String response = http.getString();
    Serial.println("Response: " + response);
  //Serial.println("HTTP Response code: " + String(httpResponseCode));
  http.end();
}

void checkForCommands() {
  if (WiFi.status() != WL_CONNECTED) {
    while (!WiFi.reconnect()) { delay(500); }
  }
  HTTPClient http;
  String endpoint = String(supabaseUrl) + "/rest/v1/" + tableName + "?id=eq.1";
  http.begin(endpoint);
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", "Bearer " + String(supabaseKey));
  int httpResponseCode = http.GET();
  if (httpResponseCode > 0) {
    StaticJsonDocument<300> doc;
    String response = http.getString();
    DeserializationError error = deserializeJson(doc, response);
    if (!error) {
      int command  = doc[0]["command"];
      int duration = doc[0]["duration"];
      if (command == 1 && !pumpActive) {
        Serial.println("==DashboardCommand===================================");
        Serial.println("---- Parsed Data ----");
        Serial.println("Pump ON for " + String(duration) + " minutes");
        Serial.println("---------------------");
        Serial2.println("TON");
        pumpActive     = true;
        pumpStartMs    = millis();
        pumpDurationMs = (unsigned long)duration * 60UL * 1000UL;
      }
    }
  }
  http.end();
}

void checkPumpTimer() {
  if (pumpActive) {
    if (millis() - pumpStartMs >= pumpDurationMs) {
      Serial2.println("TOF");
      sendData(0, 0, true);
      pumpActive = false;
      Serial.println("Pump OFF —> duration completed");
    } else {
      static unsigned long lastPrint = 0;
      if (millis() - lastPrint >= 10000UL) {
        lastPrint = millis();
        unsigned long remaining = (pumpDurationMs - (millis() - pumpStartMs)) / 1000UL;
        Serial.print("Pump running —> ");
        Serial.print(remaining);
        Serial.println("s remaining");
      }
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial2.begin(115200, SERIAL_8N1, RX2_PIN, TX2_PIN);
  WiFi.begin(SSID, PASSWORD);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) { delay(1000); Serial.print("."); }
  Serial.println("\nConnected!");
}

void loop() {
  getDataFromSTM();
  checkPumpTimer();
  if (millis() - lastCheckMs >= CHECK_INTERVAL_MS) {
    lastCheckMs = millis();
    checkForCommands();
  }
}
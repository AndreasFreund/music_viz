#include <FastLED.h>
#define PANELS 4
#include "ledUtils.h"

void processPacket(uint8_t *packet, int length) {
  if(length == PANELS * 7 * 11 * 3){
    int offset = 0;
    for(int y = 0; y < 7; y++){
      for(int x = 0; x < PANELS * 11; x++){
        drawPixel(x, y, CRGB(packet[offset], packet[offset + 1], packet[offset + 2]));
        offset += 3;
      }
    }
  }else if(length == 1 && packet[0] == '?'){
    Serial.write(0xc0);
    Serial.write(PANELS * 11);
    Serial.write(7);
    Serial.write(0xc0);
  }else if(length > 0){
    drawPixel(20,0,CRGB(255,0,0));
  }
}

void updateLEDs(void* _){
  while(true){
    FastLED.show();
    FastLED.delay(4);
  }
}
#include "slip.h"

void setup() {
  Serial.begin(921600);
  Serial.setRxBufferSize(1024);
  setupLED();
  
  TaskHandle_t Task1;
  xTaskCreatePinnedToCore(
      updateLEDs, /* Function to implement the task */
      "Task1", /* Name of the task */
      10000,  /* Stack size in words */
      NULL,  /* Task input parameter */
      1,  /* Priority of the task */
      &Task1,  /* Task handle. */
      0); /* Core where the task should run */
}
void loop() {
  if(Serial.available() > 0){
    readSLIP();
  }
}

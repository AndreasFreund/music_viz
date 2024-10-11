
// SLIP special characters
const char END = 0xC0;
const char ESC = 0xDB;
const char ESC_END = 0xDC;
const char ESC_ESC = 0xDD;

// Buffer for incoming packet
const int BUFFER_SIZE = 4096;
char buffer[BUFFER_SIZE];
unsigned int bufferIndex = 0;
bool isEscaped = false;

void readSLIP() {
  while (Serial.available() > 0){
    char c = Serial.read();

    if (c == END) {
      if (bufferIndex > 0) {
        processPacket((uint8_t*)buffer, bufferIndex);
        bufferIndex = 0;
      }
    } else if (isEscaped) {
      if (c == ESC_END) {
        buffer[bufferIndex++] = END;
      } else if (c == ESC_ESC) {
        buffer[bufferIndex++] = ESC;
      }
      isEscaped = false;
    } else if (c == ESC) {
      isEscaped = true;
    } else {
      buffer[bufferIndex++] = c;
    }

    if (bufferIndex >= BUFFER_SIZE) {
      // Buffer overflow
      bufferIndex = 0;
      break;
    }
  }
}

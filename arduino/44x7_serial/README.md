# 44x7 Matrix Arduino and Hardware Documentation
## Requirements
- Arduino IDE. Get [here](https://www.arduino.cc/en/software)
- ESP32 support for Arduino IDE. Get [here](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html)
- FastLED library. Get via Arduino IDE Library Manager. Docs [here](http://fastled.io/docs/)

## Protocol
Communication is done via serial port with baud rate 912600.

Packets are framed using [SLIP](https://en.wikipedia.org/wiki/Serial_Line_Internet_Protocol).

### PC -> ESP32
RGB buffer is sent as 3 bytes per pixel. Pixels are sent top to bottom, left to right.
For the 44x7 matrix, the buffer size is 924 bytes.

For initial setup, the PC sends a single byte: '?', which is also framed using SLIP.

### ESP32 -> PC
The ESP32 responds to the '?' byte with two bytes (also framed): screen width and screen height as uint8_t.

## Hardware Pinout
The clock signal is unused for WS281* LEDS.
The enable signal can be used to disable the 12V supply to the LEDs for power saving.

| ESP32 Pin | Function |
|-----------|----------|
| 27        | Data R   |
| 14        | Clock R  |
| 13        | Enable R |
| 16        | Data L   |
| 17        | Clock L  |
| 18        | Enable L |
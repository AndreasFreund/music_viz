#define NUM_LEDS (7 * 11 * PANELS)

#define DATA_1 27
#define CLK_1 14
#define EN_1  13

#define DATA_2 16
#define CLK_2 17
#define EN_2  18

CRGB leds[NUM_LEDS];
#if PANELS == 4
uint8_t panel_pos[4] = {1, 0, 2, 3};
bool panel_flipped[4] = {true, false, false, true};
#elif PANELS == 2
uint8_t panel_pos[2] = {0, 1};
bool panel_flipped[2] = {false, false};
#else
#error "only 2 or 4 panels supported"
#endif

void setupLED() {
  pinMode(EN_1, OUTPUT);
  digitalWrite(EN_1, HIGH);
  pinMode(CLK_1, OUTPUT);
  digitalWrite(CLK_1, LOW);
  pinMode(EN_2, OUTPUT);
  digitalWrite(EN_2, HIGH);
  pinMode(CLK_2, OUTPUT);
  digitalWrite(CLK_2, LOW);

  FastLED.addLeds<WS2812, DATA_1, GRB>(&leds[0], 77 * (PANELS / 2)).setCorrection(0xFFD0FF);
  FastLED.addLeds<WS2812, DATA_2, GRB>(&leds[77 * (PANELS / 2)], 77 * (PANELS / 2)).setCorrection(0xFFD0FF);
  FastLED.setBrightness(255 / (PANELS / 2));
  FastLED.setDither(false);
  delay(100);
  FastLED.clear();
  FastLED.show();
}

void drawPixel(int x, int y, CRGB c) {
  if(x < 0 || y < 0)
    return;
  int panel = x / 11;
  if(panel >= PANELS)
    return;
  bool flipped = panel_flipped[panel];
  int yf = flipped ? y : 6 - y;
  int xf = flipped ? x % 11 : (10 - (x % 11));
  int index = panel_pos[panel] * 77 + yf * 11 + xf;
  if (index < 0 || index >= NUM_LEDS)
    return;
  leds[index] = c;
}

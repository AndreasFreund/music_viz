# music_viz JavaScript Documentation

The music visualizer uses VideoCapture, FFT, Custom visualizer and canvas or Werbserial for output.

```mermaid
graph LR
    A[Video Capture & FFT] --> B[Visualizer]
    B --> C[Canvas]
    C -->|WebSerial| D[LED Matrix]
```

## Files
- `../index.html` - Main file
- `music.js` - Audio capture & FFT
- `viz.js` - Visualizer
- `perlin.js` - Perlin noise generator (for Visualizer)
- `serialDisplay.js` - WebSerial output
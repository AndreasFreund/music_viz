# music_viz JavaScript Documentation

The music visualizer uses VideoCapture, FFT, Custom visualizer and canvas or Werbserial for output.

```mermaid
graph LR
    A[Video Capture & FFT] --> B[Canvas]
    B -->|WebSerial| C[LED Matrix]
```

## Files
- `../index.html` - Main file
- `viz.js` - Visualizer
- `perlin.js` - Perlin noise generator (for Visualizer)
- `serialDisplay.js` - WebSerial output
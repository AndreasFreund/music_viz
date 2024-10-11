"use strict";
(function () {
    let max = 0;

    function normalize(dataArray) {
        max *= 0.995;
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > max) {
                max = dataArray[i];
            }
        }
        for (let i = 0; i < dataArray.length; i++) {
            dataArray[i] = dataArray[i] / max * 255;
        }
    }

    const low_thresh = 0.05;
    const mid_thresh = 0.3;

    function parse_lmh(dataArray) {
        if (dataArray == null || dataArray.length === 0) {
            return [0, 0, 0];
        }
        let low = 0;
        let mid = 0;
        let high = 0;
        const len = dataArray.length;
        for (let i = 0; i < dataArray.length; i++) {
            if (i < len * low_thresh) {
                low += dataArray[i];
            } else if (i < len * mid_thresh) {
                mid += dataArray[i];
            } else {
                high += dataArray[i];
            }
        }
        low /= len * low_thresh;
        mid /= len * (mid_thresh - low_thresh);
        high /= len * (1 - mid_thresh);
        return [low * 0.5, mid * 0.8, high];
    }

    let low_s = 0;
    let mid_s = 0;
    let high_s = 0;

    let t = 0;

    function range(a) {
        return Math.max(0, Math.min(255, a));
    }

    function smoothLine(i, range, width) {
        if (Math.abs(i % range) < width) {
            return Math.sin(Math.abs(i % range) / width * 3.1415);
        } else {
            return 0.0;
        }
    }

    let config = {
        size: 10,
        c: 0.5,
        width: 0.4,
        local: 1.0,
        global: 0.4
    };

    function draw(ctx, dataArray) {
        normalize(dataArray);

        let [low, mid, high] = parse_lmh(dataArray);
        low_s = Math.max(low_s * 0.95, low);
        mid_s = Math.max(mid_s * 0.95, mid);
        high_s = Math.max(high_s * 0.95, high);

        const WIDTH = ctx.canvas.width;
        const HEIGHT = ctx.canvas.height;

        for (let x = 0; x < WIDTH; x++) {
            for (let y = 0; y < HEIGHT; y++) {
                let z = noise.perlin3(x / config.size, y / config.size, t) * 0.5 + 0.5;
                let r = range(smoothLine(config.c * t * 10 / 11 + z, 1, config.width) * low_s);
                r = r * config.local + Math.max(low_s - config.global * 255, 0);
                let g = range(smoothLine(config.c * t * 10 / 13 + z, 1, config.width) * mid_s);
                g = g * config.local + Math.max(mid_s - config.global * 255, 0);
                let b = range(smoothLine(config.c * t * 10 / 17 + z, 1, config.width) * high_s);
                b = b * config.local + Math.max(high_s - config.global * 255, 0);
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }
        t += 0.01;
    }

    window.config = config;
    window.draw = draw;
})();
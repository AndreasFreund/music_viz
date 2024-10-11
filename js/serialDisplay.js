"use strict";
(function () {
    function rgba_to_rgb(rgba) {
        let rgb = new Uint8Array(rgba.length / 4 * 3);
        let j = 0;
        for (let i = 0; i < rgba.length; i++)
            if (i % 4 !== 3)
                rgb[j++] = rgba[i];
        return rgb;
    }

    function calculateGammaTable(gamma) {
        let table = [];
        for (let i = 0; i < 256; i++) {
            table.push(Math.floor(255 * Math.pow(i / 255, gamma)));
        }
        return table;
    }

    let gammaTable = calculateGammaTable(2);

    function apply_gamma(data) {
        for (let i = 0; i < data.length; i++) {
            data[i] = gammaTable[data[i]];
        }
    }

    function slipEncode(data) {
        let encoded = [];
        encoded.push(0xc0);
        for (let i = 0; i < data.length; i++) {
            if (data[i] === 0xdb) {
                encoded.push(0xdb);
                encoded.push(0xdd);
            } else if (data[i] === 0xc0) {
                encoded.push(0xdb);
                encoded.push(0xdc);
            } else {
                encoded.push(data[i]);
            }
        }
        encoded.push(0xc0);
        return encoded;
    }

    let writer = null;
    let sizeFound = false;
    window.serialSize = {width: 32, height: 18};



    async function initPort(port) {
        await port.open({baudRate: 921600});
        let tmp_writer = port.writable.getWriter();
        await tmp_writer.write(new Uint8Array([0xc0, "?".charCodeAt(0), 0xc0]));
        writer = tmp_writer;
        let reader = port.readable.getReader();
        let data = [];
        while (data.length < 4) {
            let {value, done} = await reader.read();
            if (done) {
                return;
            }
            data = data.concat(Array.from(value));
        }
        reader.releaseLock();
        if (data[0] === 0xc0 || data[3] === 0xc0) {
            window.serialSize.width = data[1];
            window.serialSize.height = data[2];
            sizeFound = true;
        }
    }

    async function serialStart() {
        return await navigator.serial.requestPort().then(async (port) => {
            await initPort(port);
            return sizeFound;
        }).catch((e) => {
            console.log(e);
            return false;
        });
    }

    async function serialResume() {
        return await navigator.serial.getPorts().then(async (ports) => {
            if (ports.length > 0) {
                await initPort(ports[0]);
                return sizeFound;
            }
            return false;
        });
    }

    async function sendFrame(ctx) {
        if (writer == null || !sizeFound
            || ctx.canvas.width !== window.serialSize.width
            || ctx.canvas.height !== window.serialSize.height) {
            return;
        }
        const imageData = rgba_to_rgb(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data);
        apply_gamma(imageData);
        const data = slipEncode(imageData);
        for(let i = 0; i < data.length; i+=128){
            await writer.write(new Uint8Array(data.slice(i, i+128)));
            await new Promise(r => setTimeout(r, 2));
        }
    }

    window.serialStart = serialStart;
    window.serialResume = serialResume;
    window.sendFrame = sendFrame;
})();
"use strict";

(function () {
    const displayMediaOptions = {
        video: true,
        audio: true,
        systemAudio: "include"
    };

    let analyser = null;
    let dataArray = null;

    async function startCapture() {
        let captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(captureStream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }

    function nextFFT() {
        analyser.getByteFrequencyData(dataArray);
        return dataArray;
    }

    window.startCapture = startCapture;
    window.nextFFT = nextFFT;
})();
/************************************
---  Tools and Helper functions  ---
************************************/
import audioContext from './audiocontext';

export function getWav(name, dict) {
    var request = new XMLHttpRequest();
    request.open('GET', "sounds/" + encodeURIComponent(name) + ".wav", true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
            dict[name] = buffer;
        }, onError);
    };
    request.send();
}

export function playSound(buffer, rate, callback) {
    // if (audioContext === null || audioContext.state !== "running") {
    //     audioContext = new AudioContext();
    // }
    if (rate === undefined) {
        rate = 1.0;
    }
    var sound = audioContext.createBufferSource();
    sound.buffer = buffer;
    sound.playbackRate.value = rate;
    sound.onended = callback;
    sound.connect(audioContext.destination);
    sound.start(0);
}

export function onError(err) {
    console.error(err);
}
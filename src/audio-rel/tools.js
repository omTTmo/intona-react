/************************************
---  Tools and Helper functions  ---
************************************/

//From http://www.sengpielaudio.com/Rechner-centfrequenz.htm
export function octFromFreq(freq)
{
  var oct = (Math.log(freq) - Math.log (261.626)) / Math.log (2) + 4.0;
  return oct;
}

export function getOctNumber(freq) {
  var lnote = octFromFreq(freq);
  var oct = Math.floor(lnote);
  // var offset = 50.0;
  var cents = 1200 * (lnote - oct);
  if (cents >= 1150) {
    cents -= 1200;
    oct++;
  }
  return oct;
}

export function noteFromPitch( frequency, baseFreq ) {
  var noteNum = 12 * (Math.log( frequency / baseFreq )/Math.log(2) );
  return Math.round( noteNum ) + 69;
}

export function frequencyFromNoteNumber( note, baseFreq ) {
  return baseFreq * Math.pow(2,(note-69)/12);
}

export function centOffset( frequency, note, baseFreq ) {
  return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note, baseFreq )) / Math.LN2 );
}

// export function getWav(name, dict) {
//     var request = new XMLHttpRequest();
//     request.open('GET', "sounds/" + encodeURIComponent(name) + ".wav", true);
//     request.responseType = 'arraybuffer';
//     request.onload = function() {
//         audioContext.decodeAudioData(request.response, function(buffer) {
//             dict[name] = buffer;
//         }, onError);
//     };
//     request.send();
// }

// export function playSound(buffer, rate, callback) {
//     // if (audioContext === null || audioContext.state !== "running") {
//     //     audioContext = new AudioContext();
//     // }
//     if (rate === undefined) {
//         rate = 1.0;
//     }
//     var sound = audioContext.createBufferSource();
//     sound.buffer = buffer;
//     sound.playbackRate.value = rate;
//     sound.onended = callback;
//     sound.connect(audioContext.destination);
//     sound.start(0);
// }

export function onError(err) {
    console.error(err);
}
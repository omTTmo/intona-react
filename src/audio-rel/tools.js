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

//Get Cent difference
export function centDiff(f1, f2) {
    return Math.floor(1200 * Math.log(f1 / f2) / Math.LN2);
}
//Get Cent differene based on base frequency
export function centOffset( frequency, note, baseFreq ) {
  return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note, baseFreq )) / Math.LN2 );
}

export function getWav(name, dict, audioctx) {
    var request = new XMLHttpRequest();
    request.open('GET', name, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        audioctx.decodeAudioData(request.response, function(buffer) {
            dict[name] = buffer;
        }, onError);
    };
    request.send();
}

export function playSound(audioctx,buffer, rate, callback) {
    // if (audioContext === null || audioContext.state !== "running") {
    //     audioContext = new AudioContext();
    // }
    if (rate === undefined) {
        rate = 1.0;
    }
    var sound = audioctx.createBufferSource();
    sound.buffer = buffer;
    sound.playbackRate.value = rate;
    sound.onended = callback;
    sound.connect(audioctx.destination);
    sound.start(0);
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function keyNumToFreq(n) {
    return Math.pow(2, (n - 49) / 12) * 440;
}

export function freqToPitch(keys, freq) {
    return keys[(freqToKeyNum(freq) +8) % 12];
}

export function freqToKeyNum(freq) {
    return Math.round(12 * (Math.log(freq / 440) / Math.LN2)) + 49;
}

export function average(v) {
    var sum = 0;
    for (var i = 0; i < v.length; i++) {
        sum += v[i];
    }
    return sum / v.length;
}

// Taken from https://gist.github.com/caseyjustus/1166258
export function median(v) {
    v.sort(function(a, b) {return a - b;});

    var half = Math.floor(v.length/2);

    if (v.length % 2) {
        return v[half];
    } else {
        return (v[half-1] + v[half]) / 2.0;
    }
}

export function startRecording(){
    console.log(this.state.width);
}


export function onError(err) {
    console.error(err);
}

var median = function(values) {
    values.sort(function(a, b) {return a - b;});

    var half = Math.floor(values.length/2);

    if (values.length % 2) {
        return values[half];
    } else {
        return (values[half-1] + values[half]) / 2.0;
    }
}

export function fadeOutMenu(arg){
  $("#menu").fadeToggle(1500);
  isRunning = true;
  setTimeout(
    function(){
      init(arg);
    },1200);
}

export function fadeInMenu(){
  $("#menu").fadeToggle(1200);
  $(".infobar").fadeToggle(700);
  isRunning = false;
}

export function isTune(){  
  $(".infobar").fadeToggle(1600).removeClass("hidden");  
}

export function isPlay(){  
  $(".playbar").fadeToggle(1600).removeClass("hidden");  
}

var getHalfHeight = function() {
  return HEIGHT / 2;  
}

var getWav = function(name, dict) {
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

// Play a sound from a data buffer
var playSound = function(buffer, rate, callback) {  
    if (audioContext === null || audioContext.state !== "running") {
        audioContext = new AudioContext();
    }
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

// Return a random integer between [min, max)
// Specify prev to guarantee a different number from prev
var getRandomInt = function(min, max, prev) {
    var rand = Math.floor(Math.random() * (max - min)) + min;
    if (prev !== undefined) {
        while (prev === rand) {
            rand = Math.floor(Math.random() * (max - min)) + min;
        }
    }
    return rand;
}

var autoCorrelate = function( buf, sampleRate ) {
  var SIZE = buf.length;
  var MAX_SAMPLES = Math.floor(SIZE/2);
  var best_offset = -1;
  var best_correlation = 0;
  var rms = 0;
  var foundGoodCorrelation = false;
  var correlations = new Array(MAX_SAMPLES);

  for (var i=0;i<SIZE;i++) {
    var val = buf[i];
    rms += val*val;
  }
  rms = Math.sqrt(rms/SIZE);
  if (rms<0.01) // not enough signal
    return -1;

  var lastCorrelation=1;
  for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    var correlation = 0;

    for (var i=0; i<MAX_SAMPLES; i++) {
      correlation += Math.abs((buf[i])-(buf[i+offset]));
    }
    correlation = 1 - (correlation/MAX_SAMPLES);
    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
    if ((correlation>0.9) && (correlation > lastCorrelation)) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {

      var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
      return sampleRate/(best_offset+(8*shift));
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
    return sampleRate/best_offset;
  }
  return -1;
//  var best_frequency = sampleRate/best_offset;
}

var average = function(value) {
    var total = 0;
    var len = value.length;
    for(i = 0; i < len; i++) {
        total += value[i];
    }
    return Math.round(total / len);
}

//From http://www.sengpielaudio.com/Rechner-centfrequenz.htm
var octFromFreq = function(freq)
{
  var oct = (Math.log(freq) - Math.log (261.626)) / Math.log (2) + 4.0;
  return oct;
}

var getOctNumber = function(freq) {
  var lnote = octFromFreq(freq);
  var oct = Math.floor(lnote);
  var offset = 50.0;
  var cents = 1200 * (lnote - oct);
  if (cents >= 1150) {
    cents -= 1200;
    oct++;
  }
  return oct;
}
//end sengpiel

var noteFromPitch = function( frequency ) {
  var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
  return Math.round( noteNum ) + 69;
}

export function frequencyFromNoteNumber( note ) {
  return 440 * Math.pow(2,(note-69)/12);
}

 export function centOffset( frequency, note ) {
  return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note )) / Math.LN2 );
}

export function onError(err) {
    console.error(err);
}

export function resizeCanvas() {
  if ( canvas.width !== window.innerWidth || canvas.height !== window.innerHeight ) {
    WIDTH = canvas.width;
    HEIGHT = canvas.height; 
    // = window.innerHeight;
    // h = HEIGHT /2;
  }
}

// $("#menu .tune").on("click", function() {
//   fadeOutMenu('tune');
//   isTune();
// })

// $('#menu .play').on("click", function(){
//   fadeOutMenu('play');
//   isPlay();
// })

// $(".four").on("click", function(){
//   fadeInMenu();
// })

// /*----------------------------
// Bootstrap JS stuff
// ----------------------------*/
// $('[data-toggle="tooltip"]').tooltip()
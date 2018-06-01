import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import VerticalMenu from './menu/vertMenu';
import { noteFromPitch, getOctNumber, centOffset, frequencyFromNoteNumber } from './audio-rel/tools';
import audioContext from './audio-rel/audiocontext';
import { Canvas } from './canvas';
import { getGaugeSkin } from './ui';

const Pitchfinder = require('pitchfinder');
const CanvasMeter = require ("canvas-meter");

//Requestanimationframe ID
var raf = null;
var h = 0;
//Global audio variables
var detectPitch = null;
var buf = null;
var analyzer = null;

// “reusable rect component”
// function rect(props) {
//     const {ctx, x, y, width, height} = props;
//     ctx.fillStyle = 'pink';
//     ctx.fillRect(x, y, width, height);
// }

class CanvasTune extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isTune: 1,
            width:  window.innerWidth,
            height: window.innerHeight*.9,
            halfH: null,
            isPlaying: 0,
            isPaused: 0,
            context: null,
            keys: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
            settings: {
            octaveNumber: 1,
            // octaveNumber: localStorage.getItem('showOctaveNr'),
            freq: 1,
            // freq: localStorage.getItem('showFreq'),
            baseFreq: 440
            // baseFreq: localStorage.getItem('setSaved') ? localStorage.getItem('baseFreq') : 440
            }
        }

        this.xRatio = 0;
        this.yRatio = 0;
        this.cent = 0;
        this.freq = 0;
    }

    componentWillMount(){
        //  Initialize pitchfinder and create the buffer that
        //  holds the stream data.
        detectPitch = Pitchfinder.Macleod();
        console.log(detectPitch);
        analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 2048;
        buf = new Float32Array(analyzer.fftSize);
        this.setState({halfH: this.state.height/2});

    }

    componentDidMount() {
        //Make sure canvas is working on user device
        const ctx = this.getCanvas().getContext('2d');
        if(!ctx) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        this.setState({ context: ctx });

        this.resizeCanvas();
        window.addEventListener("resize", this.resizeCanvas.bind(this));

        //Call Update Loop
        requestAnimationFrame(() => {this.update()});
    }

    componentWillUnmount() {
        //Flag false if we are running
        this.setState({ isPlaying: 0 });

        //Cancels the animation frame request scheduled in update()
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", this.resizeCanvas.bind(this));
    }

    getCanvas() {
        return ReactDOM.findDOMNode(this.refs.canvas);
    }

    startUp() {
        this.setState({ isPlaying:  1 });

        //Make sure user has microphone enabled
        var getUserMedia = require('getusermedia');
        getUserMedia({video: false, audio: true}, function (err, stream) {
            if (err) {
                alert("Uh oh, something went wrong while trying to get data from your microphone!");
                console.log('STREAM ERROR: ' + err.message);
            } else {
                console.log('Got audio stream!');

                const micStream = audioContext.createMediaStreamSource(stream);
                micStream.connect( analyzer );
            }
        })
        //Setup Cent "Meter" | Options are written in ui.js
        this.cent = new CanvasMeter(this.getCanvas());
        this.cent.setOptions(getGaugeSkin(this.state.height*-.23));
    }

    animateCentOffset(ctx, w, offTune, h2) {
        //If Input is off by more than +/-20 cent move the line accordingly
        if ( offTune >= 20 && offTune <= 50 ) {
            if (h <= h2 + 50 && h - h2 <= offTune ) {
                h -= 1;
            }
        }else if ( offTune <= -20 && offTune >= -50 ) {
            if ( h >= h2 -50 && h + h2 >= offTune ) {
                h += 1;
            }
        }else{ h = h2 }

        ctx.fillStyle = "black";
        ctx.fillRect(w*.42, h, w*.15, 1);
    }

    update() {
        if (!this.state.isPlaying) {
            this.startUp();
        }

        //Get the pitch object ( {Probability:x, freq: y} ) from the audio buffer and round it
        analyzer.getFloatTimeDomainData( buf );
        var currentPitch = detectPitch( buf );
        var roundedCurrPitch = Math.round(currentPitch.freq);

        //Get canvas context and draw stuff
        const ctx = this.state.context;
        ctx.fillStyle = '#fff';
        this.draw(ctx, roundedCurrPitch);

        //loop over this update() function
        raf = requestAnimationFrame(() => {this.update()});
    }

    draw(ctx, roundedCurrPitch) {
        const w = this.state.width;
        const h2 = this.state.height/2;
        var baseFreq = this.state.settings.baseFreq;

        var notes = noteFromPitch( roundedCurrPitch, baseFreq);
        const offTune = centOffset(roundedCurrPitch,notes, baseFreq);

        ctx.clearRect(0,0,w,this.state.height);

        //Display nothing when key is undefined
        ctx.font =  w/6 + "px Lato";
        // ctx.shadowColor = "#000";
        // ctx.shadowOffsetX = 4

        //Debugging baseFreq
        // ctx.fillText(this.state.settings.baseFreq,200,400);

        this.state.keys[notes%12] ===  undefined ? ctx.fillText("",0,0) : ctx.fillText( this.state.keys[notes%12], w/2*.8, h2*.6);

        /*  Settings - Octave no.   */
        //  Depending on settings render octave number and frequency
        //  Frequency can only be detected down to 80 Hz!

        ctx.font = w/10 +"px Lato";
        this.state.settings.octaveNumber && roundedCurrPitch > 80 ? ctx.fillText( getOctNumber(roundedCurrPitch), w*.8,h2*.5 ) : ctx.fillText("",0,0);

        /*  Settings - Freq     */
        //  Display Frequencies

        ctx.font = w/20 + "px Gugi";
        ctx.fillStyle = "white"
        ctx.fillText("Frequency",w*.63,this.state.height*.75);
        ctx.font = w/15 + "px Lato";

        this.state.settings.freq && roundedCurrPitch < 0 ? ctx.fillText("0", w*.75, this.state.height*.9) : ctx.fillText(roundedCurrPitch, w * .75, this.state.height*.9);

        /*  Settings - cents     */
        //  Display offset in cents and animate line accordingly
        // roundedCurrPitch > 80 ? ctx.fillText( offTune ,100,200) : ctx.fillText("",0,0);

        ctx.font = w/20 + "px Gugi";
        ctx.fillText("Cent",w*.09,this.state.height*.75);
        this.cent.draw(offTune,-50, 50, 0,"", this.state.width*.15, this.state.height*.96);

        this.animateCentOffset(ctx, w, offTune, h2);
        this.drawLines(ctx,w,h2);
    }

    drawLines(ctx, w , h2) {
        ctx.shadowColor = "transparent";
        //Draw those lines
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(w*.25, h2);
        ctx.lineTo(w*.42, h2);
        ctx.moveTo(w*.57, h2);
        ctx.lineTo(w*.75, h2);
        ctx.stroke();
        ctx.closePath();

    }

    resizeCanvas() {
        console.log('resized');            
        this.setState({ width: window.innerWidth, height: window.innerHeight })             
        var wtoh = 4/3;
        var ratio = this.state.width/wtoh;
        var neww = this.state.width;
        var newh = this.state.height;
        var newratio = neww/newh;
        if (newratio > wtoh) {
            this.setState({ width: newh *wtoh, height: newh});
        }else{
            this.setState({width:neww,height:newh/wtoh});
        }
            // if(window.innerWidth <= 1440) {
            //     this.setState({ width: window.innerWidth, height: window.innerHeight })             
            // }else if(window.innerWidth <= 1024){
            //     this.setState({ width: window.innerWidth, height: ratio})             
            // }
    }


    render() {
        var cnvStyle = {
            letterspacing: 10
        }

         return (
            <React.Fragment>
            <VerticalMenu isTune={this.state.isTune}/>
            <Canvas id="cnv" className="animated zoomIn box-shadow" ref="canvas" width={this.state.width} height={this.state.height}/>
            </React.Fragment>
         );
    }
}

export default CanvasTune;
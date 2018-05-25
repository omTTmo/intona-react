import React, { Component } from 'react';
import VerticalMenu from './menu/vertMenu';
import { noteFromPitch, getOctNumber, getWav, playSound } from './audio-rel/tools';
import audioContext from './audio-rel/audiocontext';
import { resizeCanvas } from './ui';
const Pitchfinder = require('pitchfinder');

//Maybe better to wrap these globals in the new CONTEXT API?
// var raf = null;
// var detectPitch = Pitchfinder.Macleod();
// var buf = new Float32Array(2048);
// var analyzer = audioContext.createAnalyser();
// analyzer.fftSize = 2048;

//Requestanimationframe ID
var raf = null;

//global audio variables
var detectPitch = null;
var buf = null;
var analyzer = null;


// “reusable rect component”
function rect(props) {
    const {ctx, x, y, width, height} = props;
    ctx.fillStyle = 'pink';
    ctx.fillRect(x, y, width, height);
}

class CanvasComp extends Component {

    constructor(props) {
        super(props);

        this.state = {
          width:  window.innerWidth/2,
          height: window.innerHeight*.7,
          halfH: null,
          isPlaying: 0,
          isPaused: 0,
          context: null,
          keys: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        }
        this.xRatio = 0;
        this.yRatio = 0;
    }

    componentWillMount(){
        //  Initialize pitchfinder and create the buffer that
        //  holds the stream data.
        detectPitch = Pitchfinder.Macleod();
        buf = new Float32Array(2048);
        analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 2048;
        this.setState({halfH: this.state.height/2});
    }

    componentDidMount() {
        //Make sure canvas is working on user device
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
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
        this.setState({ isPlaying: 0 });

        //Cancels the animation frame request scheduled in update()
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", this.resizeCanvas.bind(this));
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
                // if (audioContext.state === 'closed') {
                //     audioContext = new AudioContext();
                // }
                const micStream = audioContext.createMediaStreamSource(stream);
                micStream.connect( analyzer );
            }
        })
    }

    update() {
        if (!this.state.isPlaying) {
            this.startUp();
        }

        //Get the pitch object ( {Probability:x, freq: y} ) from the buffer and round it
        analyzer.getFloatTimeDomainData( buf );
        var currentPitch = detectPitch( buf );
        var roundedCurrPitch = Math.round(currentPitch.freq);

        // console.log(currentPitch)

        //Get canvas context and draw stuff
        const ctx = this.state.context;
        this.draw(ctx, roundedCurrPitch);
        //loop over this update() function
        raf = requestAnimationFrame(() => {this.update()});
    }

    draw(ctx, roundedCurrPitch) {
        const w = this.state.width;
        const h2 = this.state.halfH;
        var notes = noteFromPitch( roundedCurrPitch );

        ctx.clearRect(0,0,w,this.state.height);


        ctx.font = "120px Lato";
        ctx.fillText( this.state.keys[notes%12] + getOctNumber(roundedCurrPitch), w/2*.67, h2*(.5));

        //Display Frequencies?
        ctx.font = "36px Gugi";
        ctx.fillStyle = "white";
            // this.state.settings.freq?
        roundedCurrPitch < 0 ? ctx.fillText("", w, this.state.height)
        :
        ctx.fillText(roundedCurrPitch, w * .7, this.state.height*.9);
        ctx.strokeStyle = "white";

        //Draw those lines
        ctx.beginPath();
        ctx.moveTo(w*.25, h2);
        ctx.lineTo(w*.42, h2);
        ctx.moveTo(w*.57, h2);
        ctx.lineTo(w*.75, h2);
        ctx.stroke();
        ctx.closePath();
        //Indicator for cent offset
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(w*.42, h2);
        ctx.lineTo(w*.57, h2);
        ctx.stroke();
        ctx.closePath();
    }

    resizeCanvas() {
        console.log('resized')
        // let tempXRatio = this.state.width;
        // let tempYRatio = this.state.height;
        let mobileOrResizeX = this.state.width;
        let mobileOrResizeY = this.state.height;

        window.innerWidth <= 1024 ?
            this.setState({ width: window.innerWidth*.9, height: window.innerHeight*.65 }):this.setState({ width: window.innerWidth/2, height: window.innerHeight*.65 })
        // canvas.width = canvas.height *
        // (canvas.clientWidth / canvas.clientHeight);
        // this.xRatio = this.state.width / tempXRatio;
        // this.yRatio = this.state.height / tempYRatio;
    }

    render() {
         return (
            <React.Fragment>
            <VerticalMenu />
            <canvas id="cnv" className="animated zoomIn box-shadow" ref="canvas" width={this.state.width} height={this.state.height}/>
            </React.Fragment>
         );
    }
}

export default CanvasComp;
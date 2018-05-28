import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Canvas } from './Canvas';
import VerticalMenu from './menu/vertMenu';
import audioContext from './audio-rel/audiocontext';
import { noteFromPitch, getOctNumber, centOffset, getWav, playSound, frequencyFromNoteNumber } from './audio-rel/tools';
import sound from './sounds/C_short.wav';

const Pitchfinder = require('pitchfinder');

var raf = null;
var detectPitch = null;
var buf = null;
var analyzer = null;

class CanvasPlay extends Component {
	    constructor(props) {
        super(props);

        this.state = {
          width:  window.innerWidth/2,
          height: window.innerHeight*.7,
          halfH: null,
          isPlaying: 0,
          context: null,
          keys: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
        }
        this.reference = {};
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){
    	//	Load reference note "C"
        getWav(sound, this.reference, audioContext);

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
    }

    update() {
        if (!this.state.isPlaying) {
            this.startUp();
        }

        //Get the pitch object ( {Probability:x, freq: y} ) from the buffer and round it
        analyzer.getFloatTimeDomainData( buf );
        var currentPitch = detectPitch( buf );
        var roundedCurrPitch = Math.round(currentPitch.freq);

        //Get canvas context and draw stuff
        const ctx = this.state.context;
        ctx.fillStyle = '#fff';

        //loop over this update() function
        raf = requestAnimationFrame(() => {this.update()});
    }

    getCanvas() {
        return ReactDOM.findDOMNode(this.refs.canvas);
    }

    resizeCanvas() {
        console.log('resized')

        //Why did I write this? :()
        window.innerWidth <= 1024 ?
            this.setState({ width: window.innerWidth*.9, height: window.innerHeight*.65 }):this.setState({ width: window.innerWidth/2, height: window.innerHeight*.65 })
    }

    handleClick() {
    	playSound(audioContext, this.reference[sound]);
    }

	render() {
		return (
			<div>
			<button onClick={this.handleClick} />
			<Canvas id="cnv" className="animated zoomIn box-shadow" ref="canvas" width={this.state.width} height={this.state.height} />
			</div>
		);
	}
}

export default CanvasPlay;
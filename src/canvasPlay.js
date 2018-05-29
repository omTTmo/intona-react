	import React, { Component } from 'react';
	import ReactDOM from 'react-dom';
	import { Canvas } from './Canvas';
	import VerticalMenu from './menu/vertMenu';
	import audioContext from './audio-rel/audiocontext';
	import {
		noteFromPitch,
		getOctNumber,
		centOffset,
		getWav,
		playSound,
		frequencyFromNoteNumber,
		average,
		median,
		freqToPitch,
		freqToKeyNum,
		getRandomInt,
		centDiff,
		keyNumToFreq
		} from './audio-rel/tools';
	import sound from './sounds/C.wav';
	import rec from './img/svg/mic.svg';
	import play from './img/svg/play.svg';
	import next from './img/svg/note.svg';
	import { isIntersect } from './ui';
	const Pitchfinder = require('pitchfinder');


	var raf = null;
	var detectPitch = null;
	var buf = null;
	var analyzer = null;
	var micStream = null;
	var proc = null;
	var los = 3;

	class CanvasPlay extends Component {
		    constructor(props) {
	        super(props);

	        this.state = {
	        	//Video stuff
	        	isTune: 0,
				width:  window.innerWidth/2,
				height: window.innerHeight*.7,
				ratio: window.devicePixelRatio || 1,
				context: null,
				halfH: null,
				//Audio stuff
				isPlaying: 0,
				isRecording: 0,
				isRecordClicked: 0,
				recLength: 3,
				minPitch : 80,
				maxPitch: 4000,
				minProb: 0.60,
				minConf: 0.75,
				haveAnalysis:0,
				keys: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
				score: {
					"hit": 0,
					"sum":0,
					"percent":0
				}
	        }
	        //Video stuff
	        this.svg = new Image();
	        this.svg.src = rec;
	        this.playBut = new Image();
	        this.playBut.src = play;
	        this.nextBut = new Image();
	        this.nextBut.src = next;
	        this.reference = {};
	        this.canvasObjPos = {
	        	record: {
		        	x: null,
		        	y: null
	        	},
	        	play: {
	        		x: null,
	        		y: null
	        	},
	        	next: {
	        		x: null,
	        		y: null
	        	}
	        };
	        //Audio stuff
	        this.recIdx = 0;
	        this.recBuf = 0;
	        this.msg = 0;
	        this.timer = 0;
	        this.pitchIndex = 0;
	        this.aimPitch = 0;
	        //thisthisthis functions
	        this.getNewPitch = this.getNewPitch.bind(this);
	        this.haveRecord = this.haveRecord.bind(this);
	        this.handleClick = this.handleClick.bind(this);
	    }

	    componentWillMount(){

	    	//	Load reference note "C" from .wav file
	        getWav(sound, this.reference, audioContext);

	        //  Initialize pitchfinder and create the buffer that
	        //  holds the stream data.

	        detectPitch = Pitchfinder.Macleod();

	        // buf = new Float32Array(2048);
	        // analyzer = audioContext.createAnalyser();
	        // analyzer.fftSize = 2048;
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
	   //      this.canvasObjPos.record.x = this.getCanvas().width / 2 - this.svg.width/2 ;
	 		// this.canvasObjPos.record.y = this.getCanvas().height / 2 - 100 - this.svg.height/2;
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
	        var set = 0;
	        //Make sure user has microphone enabled
	        var getUserMedia = require('getusermedia');
	        getUserMedia({video: false, audio: true}, function (err, stream) {
	            if (err) {
	                alert("Uh oh, something went wrong while trying to get data from your microphone!");
	                console.log('STREAM ERROR: ' + err.message);
	            } else {
	                console.log('Got audio stream!');
	                micStream = audioContext.createMediaStreamSource(stream);
	                var set = 1;
	            }
	        })
	        if (set) {this.getNewPitch()}
	    }

	    getNewPitch() {
	    	this.pitchIndex = getRandomInt(this.state.keys.length);
	    	this.aimPitch = this.state.keys[this.pitchIndex];
	    	return(this.aimPitch);
	    }

	    update() {
	        if (!this.state.isPlaying) {
	            this.startUp();
	            this.getNewPitch();
	        }
	        const ctx = this.state.context;

	        this.draw();
	        //loop over this update() function
	        raf = requestAnimationFrame(() => {this.update()});
	    }

	    draw() {
	    	const w = this.state.width;
	    	const h = this.state.height ;
	    	const ctx = this.state.context;
	    	const h2 = this.getCanvas().height/2;
	    	const cnvWidth = this.getCanvas().width;
	    	const svg = this.svg;
	    	const playBut = this.playBut;
	    	const next = this.nextBut;
	    	//Scale svgs
			svg.width=cnvWidth*.15;
			playBut.width=cnvWidth*.15;

			ctx.clearRect(0,0,w,this.state.height);
			this.state.haveAnalysis ? ctx.fillText(this.msg,cnvWidth*.1,h*.21) : ctx.fillText("",0,0);
			this.state.isRecordClicked ? ctx.fillText(los,cnvWidth/2,h2) : ctx.fillText("",0,0);
			ctx.shadowColor = 'black'
			ctx.shadowOffsetX = '3';
			ctx.shadowOffsetY = '3';
			ctx.shadowBlur ='4';
	  		ctx.drawImage(svg, cnvWidth/2-svg.width/2, h2*.7-svg.height/2, cnvWidth*.15, cnvWidth*.15);
	  		ctx.drawImage(playBut, cnvWidth*.25, h2+playBut.height/3, cnvWidth*.15, cnvWidth*.15);
	  		ctx.drawImage(next, cnvWidth*.6, h2+svg.height/3,cnvWidth*.15,cnvWidth*.15);


			ctx.font = w/40+"px Lato";
			ctx.shadowColor = 'transparent'
	  		ctx.fillStyle = "white"
	  		ctx.fillText("Click for", cnvWidth*.25, h2*1.75);
	  		ctx.fillText("reference C", cnvWidth*.25, h2*1.85);
	  		ctx.fillText("Click to get", cnvWidth*.6, h2*1.75);
	  		ctx.fillText("new pitch", cnvWidth*.6, h2*1.85);
	  		ctx.fillText("<- Click record and sing:", cnvWidth*.65, h2*.7);
	  		ctx.font = w/20+"px Lato";
	  		ctx.fillText(this.aimPitch,cnvWidth*.8,h2*.88);
	  		ctx.font = w/30+"px Lato";
			ctx.fillText("Your input was G",cnvWidth*.35,h*.15);
			ctx.fillText(this.state.score.sum, cnvWidth*.1,h*.15)
			ctx.fillText("1234", cnvWidth*.1,h*.2)
	  		//ctx.fillText("note:"+next.width,100,400);
	  		//Keep values updated
	  		this.canvasObjPos.record.x = cnvWidth/2-svg.width/2;
	  		this.canvasObjPos.record.y = h2-100-svg.height/2;
	  		this.canvasObjPos.play.x = cnvWidth*.25;
	  		this.canvasObjPos.play.y = h2+playBut.height/2;
	  		this.canvasObjPos.next.x = cnvWidth*.75-next.width;
	  		this.canvasObjPos.next.y = h2+next.height/2;
	    }

	    startRecord() {
	    	if (this.state.isRecording) {
	    		return;
	    	}

	    	this.setState({isRecording: 1});
	    	this.recIdx = 0;
	    	console.log(this.recIdx);
	    	buf = audioContext.createBuffer(1, audioContext.sampleRate * this.state.recLength, audioContext.sampleRate);
	    	proc = audioContext.createScriptProcessor(2048, 1, 1);
	    	proc.onaudioprocess = this.haveRecord;
	    	var timer = 3;
	    	var interval = setInterval(function(){
	    		timer--;
	    		if (timer < 0) {
	    			clearInterval(interval);
		    		micStream.connect(proc);
		    		proc.connect(audioContext.destination);
	    		}else{
	    			if (timer == 0) {
	    				los = "Go!"
	    			}else{
	    				los = timer
	    			}
	    			console.log("los in "+timer+"...");
	    		}
	    	},1000);
	    }

	    haveRecord(audioEvent) {
	    	var input = audioEvent.inputBuffer.getChannelData(0);

	    	if (this.recIdx + input.length > buf.length ) {
	    		this.stopRecord();
	    		return;
	    	}else{
	    		buf.getChannelData(0).set(input, this.recIdx);
	    		this.recIdx += input.length;
	    	}
	    }

	    stopRecord() {
	    	if (this.state.isRecording) {
	    		micStream.disconnect();
	    		proc.disconnect();

	    		playSound(audioContext,buf);

	    		var res = this.analyzeBuf(buf);
	    		this.getResult(res);

	    		this.state.isRecording = 0;
	    	}
	    }

	    getResult(res) {
	    	var msg = 0;
	    	if (isNaN(res.confi)) {
	    		msg = "It seems that something is wrong with your microphone";
	    	}else if(res.confi <= this.state.minConf) {
	    		msg = "Try again please, this time a bit louder!";
	    	}else{
	    		var freq = res.median;
	    		var pitch = freqToPitch(this.state.keys,freq);
	    		var keyNum = freqToKeyNum(freq);
	    		var closestFreq = keyNumToFreq(keyNum);
	    		var centDiffe = centDiff(freq, closestFreq);
	    		msg = "Your input was " + pitch;

	    		if (pitch === this.aimPitch) {
	    			if (Math.abs(centDiffe) <= 15) {
	    				msg += ", right on spot!";
	    				this.state.score.hit += 5;
	    			}else if(centDiffe < -15) {
	    				msg += ", a bit high";
	    				this.state.score.hit += 2;
	    			}else {
	    				msg += ", a bit too low";
	    				this.state.score.hit += 2;
	    			}
	  			  	this.state.score.sum += 1;
	    		}else{
	    			msg = "TRY AGAIN MOTHERFUCKER"
	    		}
	    	}
	    	this.msg = msg;
	    	return msg;
	    }

	    analyzeBuf(buffer) {
	    	this.setState({haveAnalysis: 1});
	    	//pitchfinder returns an object like this: {probability:x, pitch: y}
	    	var pList = [];
	    	var probList = [];
	    	var result = 0;
	    	var samples = buf.getChannelData(0);
	    	//Get the freq out of the buffer (FFT size / 2 = 1024)
	    	for (var i = 0; i < samples.length; i+= 1024) {
	    		result = detectPitch(samples.slice(i, i + 1024));
	    		var freq = result.freq;
	    		var prob = result.probability;

	    		if(freq !== -1 && isFinite(prob)) {
	    			probList.push(prob);
	    		}
	    		if(freq !== -1 && freq >= this.state.minPitch && freq <= this.state.maxPitch && prob >= this.state.minProb) {
	    			pList.push(freq);
	    		}
	    	}

	    	return {
	    		pitch: pList,
	    		avg: average(pList),
	    		median: median(pList),
	    		confi: average(probList)
	    	};
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

	    handleClick(e) {

			const mousePos = {
				x:e.clientX - this.getCanvas().offsetLeft ,
				y:e.clientY - this.getCanvas().offsetTop
			}

			//	isIntersect(point, object,obOffset,halfWindowSize)
			if (isIntersect(mousePos,this.canvasObjPos.record,.15,this.state.width)) {
				this.startRecord();
				this.setState({isRecordClicked: 1});
			}else if(isIntersect(mousePos,this.canvasObjPos.play,.15,this.state.width)){
				playSound(audioContext, this.reference[sound]);
			}else if(isIntersect(mousePos,this.canvasObjPos.next,.15,this.state.width)){
				this.getNewPitch();
			}
	    }

		render() {
			return (
			<React.Fragment>
				<VerticalMenu isTune={this.state.isTune} />
				<Canvas id="cnv" onClick={this.handleClick} className="animated zoomIn box-shadow" ref="canvas" width={this.state.width} height={this.state.height} />
			</React.Fragment>
			);
		}
	}

	export default CanvasPlay;
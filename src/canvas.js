import React, { Component } from 'react';
import VerticalMenu from './menu/vertMenu';
import { getWav, playSound } from './audio-rel/tools';
import audioContext from './audio-rel/audiocontext';
var getUserMedia = require('getusermedia');

getUserMedia({video: false, audio: true}, function (err, stream) {
    if (err) {
       console.log('Failed receiving stream from microphone');
    } else {
       console.log('Got audio stream!');
       console.log('Got Audio!', audioContext);
    }
});

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
          isPlaying: true
        }
    }

    componentDidMount() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        this.updateCanvas();
        this.resizeCanvas();
        window.addEventListener("resize", this.resizeCanvas.bind(this));

    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeCanvas.bind(this));
    }

    resizeCanvas() {
        console.log('resized')
          this.setState({ width: window.innerWidth/2, height: window.innerHeight*.65 });
    }

    updateCanvas() {
        const canvas = this.refs.canvas;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        // draw children “components”
        for (var i = 0; i < this.state.width; i++) {
            rect({ctx, x: i*60, y: this.refs.canvas.height/2 , width:20, height:20});
        }
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
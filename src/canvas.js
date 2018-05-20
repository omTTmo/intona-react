import React, { Component } from 'react';
import BackButton from './backButton';
// “reusable component”
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
          height: window.innerHeight*.75,
          isPlaying: true
        }
    }

    componentDidMount() {
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
          this.setState({ width: window.innerWidth/2, height: window.innerHeight*.65 });
    }

    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        // draw children “components”
        for (var i = 0; i < this.state.width; i++) {
            rect({ctx, x: i*60, y: this.refs.canvas.height/2 , width:20, height:20});
        }
    }

    render() {
         return (
            <React.Fragment>
            <BackButton />
            <canvas id="cnv" className="animated zoomIn" ref="canvas" width={this.state.width} height={this.state.height}/>
            </React.Fragment>
         );
    }
}

export default CanvasComp;
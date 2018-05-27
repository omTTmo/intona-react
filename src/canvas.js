import React, { Component } from 'react';
export class Canvas extends Component {
	render() {
		return (
			<canvas id="cnv" className={this.props.className} width={this.props.width} height={this.props.height}/>
		);
	}
}

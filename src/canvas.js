import React, { Component } from 'react';
export class Canvas extends Component {
	render() {
		return (
			<canvas id="cnv" onClick={this.props.onClick} className={this.props.className} width={this.props.width} height={this.props.height}/>
		);
	}
}

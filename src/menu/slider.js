import React, { Component } from 'react';

export class Slider extends Component {
	constructor() {
		super();
		this.state = {
			min: 415,
			max: 460
		}
	}

	render() {
		return (
			<li className={this.props.classname + " animated setList"}>
				<label>
					<input
						onChange={ this.props.handleSlide }
						ref="slider"
						type="range"
						min={this.state.min}
						max={this.state.max}
						className="range"
						value={this.props.value}
					/>
					<span className="range"></span>
				</label>
				<label className="settingsLabel vert-al-m">{this.props.name + ' ' + this.props.value}</label>
			</li>
		);
	}
}

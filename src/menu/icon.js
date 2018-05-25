import React, { Component } from 'react';

export class BackIcon extends Component {
	constructor(props){
		super(props);
		var w = 45;
		this.state = {	dimensions: w };
	}
	render() {
		return(
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 188.135 188.135" width={this.state.dimensions}>
				<g fill="#FFF">
			  		<path d="M94.068 188.135C42.199 188.135 0 145.937 0 94.068S42.199 0 94.068 0s94.067 42.198 94.067 94.067-42.198 94.068-94.067 94.068zM94.068 3C43.853 3 3 43.853 3 94.068s40.853 91.067 91.068 91.067 91.067-40.853 91.067-91.067S144.283 3 94.068 3z"/>
			  		<path d="M135.635 138.125l-76.31-44.057 76.311-44.057v88.114h-.001zm-70.31-44.057l67.311 38.861V55.207L65.325 94.068zM52.635 53.068h3v82h-3z"/>
			  	</g>
			</svg>
		)
	}
}

export class PlayIcon extends Component {
	constructor(props){
		super(props);
		var w = 45;
		this.state = { dimensions: w };
	}

	render() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 188.135 188.135" width={this.state.dimensions}>
			 	<g fill="#FFF">
				  <path d="M94.067 188.135C42.198 188.135 0 145.937 0 94.067S42.198 0 94.067 0s94.067 42.198 94.067 94.067-42.196 94.068-94.067 94.068zM94.067 3C43.853 3 3 43.853 3 94.067s40.853 91.067 91.067 91.067 91.067-40.853 91.067-91.067S144.283 3 94.067 3z"/>
				  <path d="M69.067 138.124V50.01l76.311 44.057-76.311 44.057zm3-82.917v77.722l67.311-38.861-67.311-38.861z"/>
				</g>
			</svg>
		);
	}
}


export class VolumeIcon extends Component {
			constructor(props){
		super(props);
		var w = 45;
		this.state = { dimensions: w };
	}

	render() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 188.135 188.135" width={this.state.dimensions}>
				<g fill="#FFF">
  					<path d="M94.068 188.135c-51.869 0-94.067-42.198-94.067-94.068S42.199 0 94.068 0s94.067 42.198 94.067 94.067-42.196 94.068-94.067 94.068zM94.068 3C43.854 3 3.001 43.853 3.001 94.067s40.853 91.067 91.067 91.067 91.067-40.853 91.067-91.067S144.284 3 94.068 3zM53.635 114.067h3v21h-3v-21zm19.153 21.021l-.809-51.496 3-.047.809 51.496-3 .047zm18.382-.019l-.067-82.5 3-.002.067 82.5-3 .002zm18.466-51.002h3v51h-3v-51zm18.999 9h3v42h-3v-42z"/>
  				</g>
			</svg>
		);
	}
}

export class SettingsIcon extends Component {
		constructor(props){
		super(props);
		var w = 45;
		this.state = { dimensions: w };
	}

	render() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 188.135 188.135" width={this.state.dimensions}>
				<g fill="#FFF">
				  <path d="M94.067 188.135C42.198 188.135 0 145.937 0 94.067S42.198 0 94.067 0s94.067 42.198 94.067 94.067-42.196 94.068-94.067 94.068zM94.067 3C43.853 3 3 43.853 3 94.067s40.853 91.067 91.067 91.067 91.067-40.853 91.067-91.067S144.283 3 94.067 3z"/>
				  <path d="M70.635 53.067h64v3h-64zM70.635 76.067h64v3h-64zM70.635 100.067h64v3h-64zM70.635 123.067h64v3h-64z"/>
				  <circle cx="58.636" cy="53.725" r="5.229"/>
				  <circle cx="58.636" cy="76.725" r="5.229"/>
				  <circle cx="58.636" cy="100.058" r="5.229"/>
				  <circle cx="58.636" cy="123.725" r="5.229"/>
				</g>
			</svg>
		);
	}
}

// eslint-disable-next-line
import React, { Component } from 'react';
import {  createCanvas, createSettings } from '../ui';
import { SettingsButton } from '../settings';

class Menu extends Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		active: "no",
    		open: false,
    		baseClass: " gugi animated ",
    		tune: "tune",
    		play: "play"
    	};

    	this.handleClick = this.handleClick.bind(this);
    	this.fadeOutMenu = this.fadeOutMenu.bind(this);
    	this.handleSettings = this.handleSettings.bind(this);
  	}

  	componentDidMount() {
  		this.setState({active: "rotateInUpRight"});
  		this.refs.menu.classList.add("flipInY");
  	}

  	fadeOutMenu(){
  		this.setState({active: "flipOutY"});
  		this.refs.menu.classList.add("flipOutX");
	}

	handleClick(event) {
		event.preventDefault();
		const id = event.target.id;
		this.fadeOutMenu();
		setTimeout(function(){
			createCanvas(id);
		},1200);
	}

	handleSettings(event) {
		event.preventDefault();
		this.setState({open: true});
		this.fadeOutMenu();
		setTimeout(function(){
			createSettings();
		},1200);
	}

	render() {
		const open = this.state.open;
		const settingBtn = open ? (
			<SettingsButton className={this.state.active + this.state.baseClass + "open true"} handleSettings={this.handleSettings}/>
			):(
			<SettingsButton className={this.state.active + this.state.baseClass + "closed false"} handleSettings={this.handleSettings}/>
			);
		const options = ["tune", "play"];
		const buttons = options.map(butt => {
			return(
		        <div key={butt} className={butt +' welcomeButton'} onClick={this.handleClick}>
		        	<button id={butt} className={this.state.active + " " + butt + " gugi animated"}>{butt}</button>
		        </div>
				)
		})

		return (
		        <div id="menu" ref="menu" className="animated">
		          	<div id="welcome" className="window" style={{display:'initial'}}>
		              	<div id="welcomeHeader">
		                	INTONA
		              	</div>
		              	{buttons}
		              	{settingBtn}
		          	</div>
		        </div>
			)
	}
}

export default Menu;
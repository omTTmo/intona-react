// eslint-disable-next-line
import React, { Component } from 'react';
import {  createCanvas } from './ui';

class Menu extends Component {

	constructor(props) {
    	super(props);
    	this.state = { active: " ", fadein: "false" };
    	this.handleClick = this.handleClick.bind(this);
    	this.fadeOutMenu = this.fadeOutMenu.bind(this);
  	}

  	componentDidMount() {
  		this.setState({active: "rotateInUpRight"});
  		document.getElementById('menu').classList.add("flipInY");
  	}

  	fadeOutMenu(){
  		this.setState({active: "flipOutY"});
		document.getElementById('menu').classList.add( "flipOutX");
	}

	handleClick(event) {
		event.preventDefault();
		this.fadeOutMenu();
		setTimeout(function(){
			createCanvas();
		},1200);
	}

	render() {
		const options = ["tune", "practice"];
		const buttons = options.map(butt => {
			return(
		        <div key={butt} className="welcomeButton" onClick={this.handleClick}>
		        	<button id={butt} className={this.state.active + " " + butt + " gugi animated"}>{butt}</button>
		        </div>
				)
		});

		return (
		        <div id="menu" className="animated">
		          	<div id="welcome" className="window" style={{display:'initial'}}>
		              	<div id="welcomeHeader">
		                	INTONA
		              	</div>
		              	{buttons}
		          	</div>
		        </div>
			)
	}
}

export default Menu;
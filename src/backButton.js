import React, { Component } from 'react';
import { removeCanvas } from './ui';
import Menu from './menu';

class BackButton extends Component {
		constructor(props) {
    	super(props);
    	this.state = { name: "inactive" };
    	this.handleClick = this.handleClick.bind(this);
  	}

  	handleClick(event) {
		event.preventDefault();
		this.setState({ name: 'bounceOut'});
		document.getElementById('cnv').classList.add('animated','flipOutY');

		setTimeout(function(){
			removeCanvas();
		},400);
	}

	render() {
		return(
			<div className={this.state.name + " back animated"}>
				<div onClick={this.handleClick} className="btn">&larr;</div>
			</div>
		)
	}

}

export default BackButton;
import React, { Component } from 'react';
import { removeCanvas } from './ui';

class BackButton extends Component {
		constructor(props) {
    	super(props);
    	this.state = { name: "inactive" };
    	this.handleClick = this.handleClick.bind(this);
  	}

  	handleClick(event) {
		event.preventDefault();
		this.setState({ name: 'bounceOut'});
		var cnv = document.getElementById('cnv');
		cnv.classList.add('animated','zoomOut');
		cnv.classList.remove('zoomIn');

		setTimeout(function(){
			removeCanvas();
		},400);
	}

	render() {
		return(
			<div className={this.state.name + " back animated"}>
				<div onClick={this.handleClick} className="btn gugi">BACK</div>
			</div>
		)
	}

}

export default BackButton;
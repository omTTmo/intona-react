import React, { Component } from 'react';
import { fadeOutVMenu } from './ui';
import { BackIcon } from './icon';

class BackButton extends Component {
		constructor(props) {
    	super(props);
    	this.state = { clicked: false };
    	this.handleClick = this.handleClick.bind(this);
  	}

  	handleClick(event) {
		event.preventDefault();
		this.setState({ clicked: true});
		fadeOutVMenu();
	}

	render() {
		var className = this.state.clicked ? 'bounceOut' :'zoomIn';
		return(
			<div className={className + " back animated"}>
				<div onClick={this.handleClick} className="btn gugi">
					<BackIcon />
				</div>
			</div>
		)
	}

}

export default BackButton;
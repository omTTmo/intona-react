import React, { Component } from 'react';
import { BackIcon } from './icon';

class BackButton extends Component {
		constructor(props) {
    	super(props);
    	this.state = { clicked: false };
  	}

	render() {
		var baseClass = " back animated "
		return(
			<div className={baseClass + this.props.className + this.props.name}>
				<div onClick={this.props.goBack} className="btn gugi">
					<BackIcon />
				</div>
			</div>
		)
	}

}

export default BackButton;
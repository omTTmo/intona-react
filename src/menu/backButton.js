import React, { Component } from 'react';
import { BackIcon } from './icon';

class MenuButton extends Component {
		constructor(props) {
    	super(props);
    	this.state = { clicked: false };
  	}

	render() {

		return(
			<div className={this.props.baseclass + this.props.classname + this.props.name}>
				<div onClick={this.props.goBack} className="btn gugi">
					<BackIcon />
				</div>
			</div>
		)
	}

}

export default MenuButton;
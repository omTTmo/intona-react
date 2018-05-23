import React, { Component } from 'react';
import BackButton  from './backButton';
import { fadeOutVMenu } from '../ui'
class VerticalMenu extends Component {
	constructor(props){
		super(props);
		this.state = { active: false };
		this.handleClick = this.handleClick.bind(this);
		this.goBack = this.goBack.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		this.setState({ active: true });
	}

	goBack(event) {
		event.preventDefault();
		this.setState({ clicked: true});
		fadeOutVMenu();
	}

	render() {
		const items = ['Choose Instrument','More Options','volume'];
		const names = "vmenu-item box-shadow";

		const listItems = items.map((item, index) => {
			return(
				<li onClick={this.handleClick} key={index + 1} className={names}>{item}</li>
			)
		});

		var className = this.state.active ? 'choose' :'fadeInLeft';

		return(
			<div id="vmenu" className={className + ' back animated'}>
				<ul className="vmenu-wrap">
					<li key="0" className={names}>
						<BackButton goBack={this.goBack} name=" vertMenu" />
					</li>
					{listItems}
				</ul>
			</div>
			)
	}
}

export default VerticalMenu;
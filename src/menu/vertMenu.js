import React, { Component } from 'react';
import BackButton  from './backButton';
import MenuButton  from './menubutton';
import { fadeOutVMenu, createSettings } from '../ui'

class VerticalMenu extends Component {
	constructor(props){
		super(props);
		this.state = { active: false };
		this.handleClick = this.handleClick.bind(this);
		this.goBack = this.goBack.bind(this);
	}

	handleClick(e) {
		e.preventDefault();
		this.setState({ active: true });
		e.target
	}

	goBack(e) {
		e.preventDefault();
		this.setState({ clicked: true});
		fadeOutVMenu();
	}

	handleSettings(event) {
		event.preventDefault();

		fadeOutVMenu();
		setTimeout(function(){
			createSettings();
		},400);
	}

	render() {

		const names = "vmenu-item box-shadow";
		const baseClass = " back animated ";
		var className = this.state.active ? ' choose ' :' fadeInLeft ';

		return(
			<div id="vmenu" className={className + ' back animated'}>
				<ul className="vmenu-wrap">
					<li key="0" className={names}>
						<BackButton goBack={this.goBack} name=" vertMenu" baseclass={baseClass} classname={className} />
					</li>
					<MenuButton handleSettings={this.handleSettings} handleClick={this.handleClick} name=" vertMenu" baseclass={baseClass} classname={className} />
				</ul>
			</div>
			)
	}
}

export default VerticalMenu;
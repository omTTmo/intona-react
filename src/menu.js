// eslint-disable-next-line 
import React, { Component } from 'react';
import { fadeOutMenu } from './ui';

class Menu extends Component {
	render() {
		const options = ["tune", "practice"];
		const buttons = options.map(butt => {
			return(					
		        <div key={butt} className="welcomeButton" onClick={fadeOutMenu}>
		        	<button className={butt+"gugi"}>{butt.toUpperCase}</button>
		        </div>
				)
		});

		return (
		        <div id="menu">
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
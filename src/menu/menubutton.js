import React, { Component } from 'react';
import { PlayIcon, SettingsIcon, VolumeIcon} from './icon';

class MenuButton extends Component {
		constructor(props) {
    	super(props);
    	this.state = { clicked: false };
  	}

	render() {
		const names = "vmenu-item box-shadow";
		const ids = ["play","tune","settings"];

			return(
				<React.Fragment>
				<li id="play" onClick={this.props.handleClickPlay} className={ this.props.isTune ? names + ' play visible ': names+' play hidden ' }>
					<div className={this.props.baseclass + this.props.classname + this.props.name }>
						<div onClick={this.props.handleClick} className="btn gugi">
							<PlayIcon name="Instrument"/>
						</div>
					</div>
				</li>
				<li id="tune" onClick={this.props.handleClickTune}  className={ this.props.isTune ? names+' tune hidden ': names + ' tune visible ' }>
					<div className={this.props.baseclass + this.props.classname + this.props.name }>
						<div onClick={this.props.handleClick} className="btn gugi">
							<VolumeIcon name="Volume"/>
						</div>
					</div>
				</li>
				<li id="settings" onClick={this.props.handleSettings}  className={ names+' settings visible' }>
					<div className={this.props.baseclass + this.props.classname + this.props.name }>
						<div onClick={this.props.handleClick} className="btn gugi">
							<SettingsIcon name="Settings" />
						</div>
					</div>
				</li>
				</React.Fragment>
			)
	}
}

export default MenuButton;
// eslint-disable-next-line
import React, { Component } from 'react';
import BackButton from './menu/backButton';
import { removeCanvas } from './ui';
import { Slider } from './menu/slider';

export class SettingsButton extends Component {

	render() {
		return(
			 <div className="welcomeButton">
		        <button id="settings" onClick={this.props.handleSettings} className={this.props.className}>Settings</button>
		     </div>
		)
	}
}

export class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clicked: false,
			name : " back animated settingsBack",
			setSaved : false,
			showFreq: localStorage.getItem('showFreq'),
			showOctaveNr: localStorage.getItem('showOctaveNr'),
			baseFreq: localStorage.getItem('baseFreq')
			};
		this.goBack = this.goBack.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSlide = this.handleSlide.bind(this);
	}

	componentDidMount() {
		localStorage.setItem('setSaved', true);
		localStorage.getItem('baseFreq') === null ? localStorage.setItem('baseFreq', 440) : localStorage.setItem('baseFreq', this.state.baseFreq);
	}

	goBack(event) {
		this.setState({clicked:true});
		event.preventDefault();
		setTimeout(function(){
			removeCanvas();
		},400);
	}

	handleChange(event) {
		localStorage.setItem(event.target.name, event.target.checked);
		this.setState({[event.target.name]: event.target.checked});
		event.target.checked ? event.target.removeAttribute('checked') : event.target.setAttribute("checked", true);
	}

	handleSlide(event) {
		const ev = event.target.value
		localStorage.setItem('baseFreq', ev)
		this.setState({baseFreq: ev});
	}

	render() {
		var className = this.state.clicked ? ' flipOutY' :' zoomIn';

		const listItems = ['Display Frequency', 'Show Octave Number'];
		const state = ['showFreq', 'showOctaveNr'];
		const cache = localStorage.getItem('setSaved');
		const list = listItems.map((item, index) => {
			return(
				<li className={className + " animated setList"} key={index}>
					<label className="switch vert-al-m">
						<input
							ref={'checkbox'+index}
							onChange={this.handleChange}
							type="checkbox"
							name={state[index]}
						/>
						<span className="slider round"></span>
					</label>
					<label className="settingsLabel vert-al-m">{item}</label>
				</li>
			)
		})

		return(
			<ul className="settings-wrapper">
			<BackButton className={className} name={this.state.name + className} goBack={this.goBack} />
				{list}
			<Slider name="Base Frequency" classname={className} handleSlide={this.handleSlide} value={!cache  ? "440" : localStorage.getItem('baseFreq')}/>
			</ul>
		)
	}
}


// eslint-disable-next-line
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CanvasComp from './canvas';
import Menu from './menu';

// export function fadeOutMenu(el) {
// 	el.setState({active: "flipOutX"});
// 	setTimeout(function(){
// 		document.getElementById('menu').classList.add("animated", "flipOutY");
// 	},400);
// }

// export function fadeInMenu(el) {
// 	ReactDOM.render(<Menu />, document.getElementById('root'));
// 	setTimeout(function(){
// 	el.setState({active: "flipInX"});
// 		document.getElementById('menu').classList.remove('flipOutY').classList.add("flipInY");
// 	},400);
// }

export function createCanvas() {
	ReactDOM.render(<CanvasComp />, document.getElementById('root'));
}

export function removeCanvas() {
	ReactDOM.render(<Menu  />, document.getElementById('root'));
}
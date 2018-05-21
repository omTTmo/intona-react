// eslint-disable-next-line
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CanvasComp from './canvas';
import Menu from './menu';

export function createCanvas() {
	ReactDOM.render(<CanvasComp />, document.getElementById('root'));
}

export function removeCanvas() {
	ReactDOM.render(<Menu  />, document.getElementById('root'));
}

export function fadeOutVMenu() {
	var cnv = document.getElementById('cnv');
	cnv.classList.remove('zoomIn');
	cnv.classList.add('animated','zoomOut');
	setTimeout(function(){
		removeCanvas();
	},400);
}

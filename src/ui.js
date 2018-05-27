// eslint-disable-next-line
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CanvasTune from './canvasTune';
import CanvasPlay from './canvasPlay';
import Menu from './menu/menu';
import { Settings } from './settings';

export function createCanvas(id) {
	id === 'tune' ?
	ReactDOM.render(<CanvasTune />, document.getElementById('root'))
	:
	ReactDOM.render(<CanvasPlay />, document.getElementById('root'));
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

export function	createSettings() {
	ReactDOM.render(<Settings />, document.getElementById('root'));
}

export function getGaugeSkin(label) {
	return {
		meter: {
	      ramp: [
	      	{stop: 0,color:'rgba(250,250,250,.4)'},
        	{stop: 1,color:'rgba(250,250,250,.4)'},
        	],
	      colors: {
	        background: 'transparent',
	        label: '#FFFFFF',
	        tickLabel: 'black'
	      },
	      offsets: {
	        ideal:-14,
	        value:-260,
	        label:label,
	        meter:-20,
	        tickLabel:-50,
	        tick:-26,
	        pointer:-12
	      },
	      ticks: {
	        major: {
	          height: 12,
	          width: 1,
	          count: 5
	        },
	        minor: {
	          height: 0,
	          width: 2,
	          count: 0
	        },
	        pointer: {
	          height: 80,
	          width: 28
	        }
	      },
	      fonts: {
	        label: '3em sans',
	        tickLabel: '1em Helvetica',
	        ideal: '0em Lato',
	        value: '0em Gugi',
	      },
	      formatters: {
	        value: (v) => typeof v === typeof undefined ? "" : "",
	        ideal: (v) => typeof v === typeof undefined ? "" : "",
	        // label: (v) => typeof v === typeof undefined ? "" : `${v.toString()}`,
	        tickLabel: (v) => typeof v === typeof undefined ? "" : `${Math.round(v).toString()}`,
	      },
	      arc: {
	        size: .6,
	        width: 28
	      }
	    }
	}
}
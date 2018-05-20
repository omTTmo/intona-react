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
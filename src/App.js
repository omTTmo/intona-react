import React, { Component } from 'react';
// eslint-disable-next-line
import logo from './logo.svg';
import './App.css';
import Menu from './menu';

// import {fadeOutMenu, fadeInMenu, isPlay, isTune} from './utility';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

class App extends Component {
  render() {
    return (
      <Menu />
    );
  }
}

export default App;
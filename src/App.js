import React, { Component } from 'react';
// eslint-disable-next-line
import logo from './logo.svg';
import './App.css';
import Menu from './menu/menu';
import './animate.css';
import CanvasTune from './canvasTune';
// import {fadeOutMenu, fadeInMenu, isPlay, isTune} from './utility';

class App extends Component {
  render() {
    return (
      // <Menu />
      <CanvasTune />
    );
  }
}

export default App;
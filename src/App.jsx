import React from 'react';

import { message } from 'antd';
import Axios from 'axios';

import Routes from './routes';

import './App.css';
import NavBar from './shared_ui/layout/nav_bar';

message.config({
  maxCount: 2,
});

Axios.defaults.baseURL = 'https://damp-garden-93707.herokuapp.com/';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes />
    </div>
  );
}

export default App;

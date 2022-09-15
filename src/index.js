import React from 'react';
import ReactDOM from 'react-dom';
import './globalStyle/index.css';
import App from './App';
import axios from 'axios';
axios.defaults.baseURL = process.env.PROCAD_API_URL || process.env.REACT_APP_API_URL

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
import React from 'react';
import ReactDOM from 'react-dom';

import { StylesProvider } from '@material-ui/core/styles';

import './styles/bootstrap-grid.min.css';
import './styles/index.scss';

import App from './App';

export const userDeviceIsMobile = /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(
  window.navigator.userAgent
);

if (userDeviceIsMobile) {
  document.body.classList.add('mobile');
} else {
  document.body.classList.add('desktop');
}

ReactDOM.render(
  <StylesProvider injectFirst>
    <App />
  </StylesProvider>,
  document.querySelector('#root') || document.createElement('div')
);

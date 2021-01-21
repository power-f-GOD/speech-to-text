import React from 'react';
import ReactDOM from 'react-dom';

import { StylesProvider } from '@material-ui/core/styles';

import './styles/bootstrap-grid.min.css';
import './styles/index.scss';

import App from './App';

export const userDeviceIsMobile = /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(
  window.navigator.userAgent
);
export const isMac = /Mac(\sOS)?/i.test(window.navigator.userAgent);

document.body.classList.add(userDeviceIsMobile ? 'mobile' : 'desktop');
document.body.classList.add(isMac ? 'is-mac' : 'is-pc');

ReactDOM.render(
  <StylesProvider injectFirst>
    <App />
  </StylesProvider>,
  document.querySelector('#root') || document.createElement('div')
);

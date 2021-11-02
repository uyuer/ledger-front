/*
 * @Author: your name
 * @Date: 2020-06-09 17:32:09
 * @LastEditTime: 2020-06-19 13:53:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \account-client\src\index.js
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';
import index from './index.css';
import * as serviceWorker from './serviceWorker';

import Root from './routes/root';

const GlobalStyle = createGlobalStyle`
  ${reset}
  ${index}
  /* other styles */
`

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <Root />
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

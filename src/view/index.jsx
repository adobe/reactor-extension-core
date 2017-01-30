/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';

import './style.pattern';
import bridgeAdapter from './bridgeAdapter';
import reducer from './reduxActions/reducer';
import createRouter from './createRouter';

const finalCreateStore = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = finalCreateStore(reducer, {});
const setFormConfigForCurrentRoute = bridgeAdapter(window.extensionBridge || {}, store);
const router = createRouter(setFormConfigForCurrentRoute);

ReactDOM.render((
  <div>
    <Provider store={ store }>
      { router }
    </Provider>
  </div>
), document.getElementById('content'));


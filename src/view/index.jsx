'use strict';
import './style.pattern';
import React from 'react';
import ReactDOM from 'react-dom';

import bridgeAdapter from './bridgeAdapter';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import createReducer from './actions/createReducer';
import createRouter from './createRouter';

const finalCreateStore = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

let internalBridgeAdapterReducers;
const getBridgeAdapterReducers = () => internalBridgeAdapterReducers;
const setBridgeAdapterReducers = bridgeAdapterReducers => {
  internalBridgeAdapterReducers = bridgeAdapterReducers;
};
const reducer = createReducer(getBridgeAdapterReducers);
const store = finalCreateStore(reducer, {});
bridgeAdapter(getBridgeAdapterReducers, extensionBridge, store);
const router = createRouter(setBridgeAdapterReducers);

ReactDOM.render((
  <div>
    <Provider store={store}>
      {router}
    </Provider>
  </div>
), document.getElementById('content'));


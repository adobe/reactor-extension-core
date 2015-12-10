'use strict';
import 'style!css?sourceMap!stylus!import-glob!./style.pattern';
import React from 'react';
import { Router, Route } from 'react-router';
import ReactDOM from 'react-dom';
import Click from './events/click';
import bridgeAdapter from './bridgeAdapter';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import { Map } from 'immutable';
import reducer from './actions/index';

const finalCreateStore = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

let store = finalCreateStore(reducer, Map());

bridgeAdapter(extensionBridge, store);

ReactDOM.render((
  <div>
    <Provider store={store}>
      <Router>
        <Route path="/events/click" component={Click}/>
      </Router>
    </Provider>
  </div>
), document.getElementById('content'));


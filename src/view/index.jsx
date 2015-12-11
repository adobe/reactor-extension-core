'use strict';
import './style.pattern';
import React from 'react';
import { Router, Route } from 'react-router';
import ReactDOM from 'react-dom';
import Click from './events/click';
import Blur from './events/blur';
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
        <Route path="/events/blur" component={Blur}/>
      </Router>
    </Provider>
  </div>
), document.getElementById('content'));


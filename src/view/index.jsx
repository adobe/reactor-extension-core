'use strict';
import React from 'react';
import { Router, Route } from 'react-router';
import ReactDOM from 'react-dom';
import Click from './events/click';
import 'style!css?sourceMap!stylus!import-glob!./style.pattern';
import store from './store';
import {init} from './actions';
import Immutable from 'immutable';

// temporary
//var xyz = {
//  elementProperties: {
//    foo: /b\/a\.r/i,
//    bing: 'baz'
//  }
//};
//setInterval(function() {
//  console.log(config);
//}, 1000);

init.push(Immutable.fromJS({
  elementSelector: 'woot',
  elementProperties: {
    foo: 'bar',
    goo: /shoe/i
  }
}));

//extensionBridge.setConfig = function(config) {
//  store.setConfig(config);
//};
//
//extensionBridge.getConfig = store.getConfig;
//
ReactDOM.render((
  <Router>
    <Route path="/events/click" component={Click}/>
  </Router>
), document.getElementById('content'));


//setTimeout(function() {
//  store.setConfig({
//    selector: 'a',
//    elementProperties: {
//      'innerHTML': 'woot'
//    }
//  });
//}, 3000);

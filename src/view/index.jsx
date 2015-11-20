'use strict';
import React from 'react';
import { Router, Route } from 'react-router';
import ReactDOM from 'react-dom';
import Click from './events/click';
import 'style!css?sourceMap!stylus!import-glob!./style.pattern';
import store from './store';

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

extensionBridge.setConfig = function(config) {
  store.setConfig(config);
};

extensionBridge.getConfig = store.getConfig;

ReactDOM.render((
  <Router>
    <Route path="/events/click" component={Click}/>
  </Router>
), document.getElementById('content'));

//setTimeout(function() {
//  extensionBridge.setConfig({
//    delayLinkActivation: true,
//    elementProperties: {
//      foo: 'bar'
//    }
//  });
//}, 3000);

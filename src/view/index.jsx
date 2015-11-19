'use strict';
import React from 'react';
import { Router, Route } from 'react-router';
import ReactDOM from 'react-dom';
import Click from './events/click';
import 'style!css?sourceMap!stylus!import-glob!./style.pattern';
import {config} from './store/config';

// temporary
//config.elementProperties = {
//  foo: /b\/a\.r/i,
//  bing: 'baz'
//};
//setInterval(function() {
//  console.log(config);
//}, 1000);


ReactDOM.render((
  <Router>
    <Route path="/events/click" component={Click}/>
  </Router>
), document.getElementById('content'));

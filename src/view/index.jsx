'use strict';
import 'style!css?sourceMap!stylus!import-glob!./style.pattern';
import React from 'react';
import { Router, Route } from 'react-router';
import ReactDOM from 'react-dom';
import Click from './events/click';
import bridgeAdapter from './bridgeAdapter';

ReactDOM.render((
  <Router>
    <Route path="/events/click" component={Click}/>
  </Router>
), document.getElementById('content'));

bridgeAdapter(extensionBridge);

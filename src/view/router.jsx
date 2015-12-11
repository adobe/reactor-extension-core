import React from 'react';
import { Router, Route } from 'react-router';

import Click from './events/click';
import Blur from './events/blur';

import { setBridgeAdapterReducer } from './bridgeAdapter';
import clickReducerSet from './bridgeReducerSets/clickReducerSet';
import blurReducerSet from './bridgeReducerSets/blurReducerSet';

export default (
  <Router>
    <Route path="/events/click" component={Click} reducer={clickReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/events/blur" component={Blur} reducer={blurReducerSet} onEnter={setBridgeAdapterReducer}/>
  </Router>
)

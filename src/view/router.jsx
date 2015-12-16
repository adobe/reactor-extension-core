import React from 'react';
import { Router, Route } from 'react-router';

import Click from './eventDelegates/click';
import Blur from './eventDelegates/blur';
import Cookie from './dataElementDelegates/cookie';

import { setBridgeAdapterReducer } from './bridgeAdapter';
import clickReducerSet from './eventDelegates/bridgeReducerSets/clickReducerSet';
import blurReducerSet from './eventDelegates/bridgeReducerSets/blurReducerSet';
import cookieReducerSet from './dataElementDelegates/bridgeReducerSets/cookieReducerSet';

export default (
  <Router>
    <Route path="/events/click" component={Click} reducer={clickReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/events/blur" component={Blur} reducer={blurReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/dataElements/cookie" component={Cookie} reducer={cookieReducerSet} onEnter={setBridgeAdapterReducer}/>
  </Router>
)

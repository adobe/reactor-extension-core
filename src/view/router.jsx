import React from 'react';
import { Router, Route } from 'react-router';

// Events
import ClickEvent from './eventDelegates/click';
import clickEventReducerSet from './eventDelegates/bridgeReducerSets/clickReducerSet';

import BlurEvent from './eventDelegates/blur';
import blurEventReducerSet from './eventDelegates/bridgeReducerSets/blurReducerSet';

// Data Elements
import CookieDataElement from './dataElementDelegates/cookie';
import cookieDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/cookieReducerSet';

import CustomDataElement from './dataElementDelegates/custom';
import customDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/customReducerSet';

import { setBridgeAdapterReducer } from './bridgeAdapter';

export default (
  <Router>
    <Route path="/events/click" component={ClickEvent} reducer={clickEventReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/events/blur" component={BlurEvent} reducer={blurEventReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/dataElements/cookie" component={CookieDataElement} reducer={cookieDataElementReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/dataElements/custom" component={CustomDataElement} reducer={customDataElementReducerSet} onEnter={setBridgeAdapterReducer}/>
  </Router>
);

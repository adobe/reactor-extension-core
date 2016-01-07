import React from 'react';
import { Router, Route } from 'react-router';

// Events
import ClickEvent from './eventDelegates/click';
import clickEventReducerSet from './eventDelegates/bridgeReducerSets/clickReducerSet';

import DirectCallEvent from './eventDelegates/directCall';
import directCallEventReducerSet from './eventDelegates/bridgeReducerSets/directCallReducerSet';

import BlurEvent from './eventDelegates/blur';
import blurEventReducerSet from './eventDelegates/bridgeReducerSets/blurReducerSet';

// Conditions
import BrowserCondition from './conditionDelegates/browser';
import browserConditionReducerSet from './conditionDelegates/bridgeReducerSets/browserReducerSet';

import CookieCondition from './conditionDelegates/cookie';
import cookieConditionReducerSet from './conditionDelegates/bridgeReducerSets/cookieReducerSet';

import CookieOptOutCondition from './conditionDelegates/cookieOptOut';
import cookieOptOutConditionReducerSet from './conditionDelegates/bridgeReducerSets/cookieOptOutReducerSet';

import CustomCondition from './conditionDelegates/custom';
import customConditionReducerSet from './conditionDelegates/bridgeReducerSets/customReducerSet';

import DeviceTypeCondition from './conditionDelegates/deviceType';
import deviceTypeConditionReducerSet from './conditionDelegates/bridgeReducerSets/deviceTypeReducerSet';

import DomainCondition from './conditionDelegates/domain';
import domainConditionReducerSet from './conditionDelegates/bridgeReducerSets/domainReducerSet';

// Data Elements
import CookieDataElement from './dataElementDelegates/cookie';
import cookieDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/cookieReducerSet';

import CustomDataElement from './dataElementDelegates/custom';
import customDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/customReducerSet';

import DOMDataElement from './dataElementDelegates/dom';
import domDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/domReducerSet';

import QueryParamDataElement from './dataElementDelegates/queryParam';
import queryParamDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/queryParamReducerSet';

import VariableDataElement from './dataElementDelegates/variable';
import variableDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/variableReducerSet';

import { setBridgeAdapterReducer } from './bridgeAdapter';

export default (
  <Router>
    <Route path="/events/click" component={ClickEvent} reducer={clickEventReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/events/directCall" component={DirectCallEvent} reducer={directCallEventReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/events/blur" component={BlurEvent} reducer={blurEventReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/conditions/browser" component={BrowserCondition} reducer={browserConditionReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/conditions/cookie" component={CookieCondition} reducer={cookieConditionReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/conditions/cookieOptOut" component={CookieOptOutCondition} reducer={cookieOptOutConditionReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/conditions/custom" component={CustomCondition} reducer={customConditionReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/conditions/deviceType" component={DeviceTypeCondition} reducer={deviceTypeConditionReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/conditions/domain" component={DomainCondition} reducer={domainConditionReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/dataElements/cookie" component={CookieDataElement} reducer={cookieDataElementReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/dataElements/custom" component={CustomDataElement} reducer={customDataElementReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/dataElements/dom" component={DOMDataElement} reducer={domDataElementReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/dataElements/queryParam" component={QueryParamDataElement} reducer={queryParamDataElementReducerSet} onEnter={setBridgeAdapterReducer}/>
    <Route path="/dataElements/variable" component={VariableDataElement} reducer={variableDataElementReducerSet} onEnter={setBridgeAdapterReducer}/>
  </Router>
);

import React from 'react';
import { Router, Route } from 'react-router';

// Events
import ClickEvent, { reducers as clickEventReducers } from './eventDelegates/click';

//import DirectCallEvent from './eventDelegates/directCall';
//import directCallEventReducerSet from './eventDelegates/bridgeReducerSets/directCallReducerSet';
//
//import BlurEvent from './eventDelegates/blur';
//import blurEventReducerSet from './eventDelegates/bridgeReducerSets/blurReducerSet';
//
//// Conditions
//import BrowserCondition from './conditionDelegates/browser';
//import browserConditionReducerSet from './conditionDelegates/bridgeReducerSets/browserReducerSet';
//
//import CartAmountCondition from './conditionDelegates/cartAmount';
//import cartAmountConditionReducerSet from './conditionDelegates/bridgeReducerSets/cartAmountReducerSet';
//
//import CookieCondition from './conditionDelegates/cookie';
//import cookieConditionReducerSet from './conditionDelegates/bridgeReducerSets/cookieReducerSet';
//
//import CookieOptOutCondition from './conditionDelegates/cookieOptOut';
//import cookieOptOutConditionReducerSet from './conditionDelegates/bridgeReducerSets/cookieOptOutReducerSet';
//
//import CustomCondition from './conditionDelegates/custom';
//import customConditionReducerSet from './conditionDelegates/bridgeReducerSets/customReducerSet';
//
//import DeviceTypeCondition from './conditionDelegates/deviceType';
//import deviceTypeConditionReducerSet from './conditionDelegates/bridgeReducerSets/deviceTypeReducerSet';
//
//import DomainCondition from './conditionDelegates/domain';
//import domainConditionReducerSet from './conditionDelegates/bridgeReducerSets/domainReducerSet';
//
import URLParameterCondition from './conditionDelegates/urlParameter';
//
//// Data Elements
import CookieDataElement from './dataElementDelegates/cookie';
//import cookieDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/cookieReducerSet';
//
import CustomDataElement from './dataElementDelegates/custom';
//import customDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/customReducerSet';
//
import DOMDataElement, { reducers as domDataElementReducers } from './dataElementDelegates/dom';
//import domDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/domReducerSet';
//
import QueryParamDataElement, { reducers as queryParamReducers } from './dataElementDelegates/queryParam';
//import queryParamDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/queryParamReducerSet';
//
//import VariableDataElement from './dataElementDelegates/variable';
//import variableDataElementReducerSet from './dataElementDelegates/bridgeReducerSets/variableReducerSet';

import { setBridgeAdapterReducers } from './bridgeAdapter';

export default (
  <Router>
    <Route path="/events/click" component={ClickEvent} reducers={clickEventReducers} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/urlParameter" component={URLParameterCondition} onEnter={setBridgeAdapterReducers}/>
    <Route path="/dataElements/cookie" component={CookieDataElement} onEnter={setBridgeAdapterReducers}/>
    <Route path="/dataElements/custom" component={CustomDataElement} onEnter={setBridgeAdapterReducers}/>
    <Route path="/dataElements/dom" component={DOMDataElement} reducers={domDataElementReducers} onEnter={setBridgeAdapterReducers}/>
    <Route path="/dataElements/queryParam" component={QueryParamDataElement} reducers={queryParamReducers} onEnter={setBridgeAdapterReducers}/>
    {/*<Route path="/events/directCall" component={DirectCallEvent} reducers={directCallEventReducerSet} onEnter={setBridgeAdapterReducers}/>
    <Route path="/events/blur" component={BlurEvent} reducers={blurEventReducerSet} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/browser" component={BrowserCondition} reducers={browserConditionReducerSet} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/cartAmount" component={CartAmountCondition} reducers={cartAmountConditionReducerSet} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/cookie" component={CookieCondition} reducers={cookieConditionReducerSet} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/cookieOptOut" component={CookieOptOutCondition} reducers={cookieOptOutConditionReducerSet} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/custom" component={CustomCondition} reducers={customConditionReducerSet} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/deviceType" component={DeviceTypeCondition} reducers={deviceTypeConditionReducerSet} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/domain" component={DomainCondition} reducers={domainConditionReducerSet} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/urlParameter" component={URLParameterCondition} reducers={urlParameterReducerSet} onEnter={setBridgeAdapterReducers}/>
    <Route path="/dataElements/variable" component={VariableDataElement} reducers={variableDataElementReducerSet} onEnter={setBridgeAdapterReducers}/>*/}
  </Router>
);

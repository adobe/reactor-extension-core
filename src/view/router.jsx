import React from 'react';
import { Router, Route } from 'react-router';
import { setBridgeAdapterReducers } from './bridgeAdapter';

// Events
import BlurEvent, { reducers as blurEventReducers } from './eventDelegates/blur';
import ClickEvent, { reducers as clickEventReducers } from './eventDelegates/click';
import DirectCallEvent from './eventDelegates/directCall';

// Conditions
import BrowserCondition, { reducers as browserConditionReducers } from './conditionDelegates/browser';
import CartAmountCondition, { reducers as cartAmountConditionReducers } from './conditionDelegates/cartAmount';
import CookieCondition from './conditionDelegates/cookie';
import CookieOptOutCondition from './conditionDelegates/cookieOptOut';
import CustomCondition from './conditionDelegates/custom';
import DeviceTypeCondition, { reducers as deviceTypeConditionReducers } from './conditionDelegates/deviceType';
import DomainCondition, { reducers as domainConditionReducers } from './conditionDelegates/domain';
import URLParameterCondition from './conditionDelegates/urlParameter';

// Data Elements
import CookieDataElement from './dataElementDelegates/cookie';
import CustomDataElement from './dataElementDelegates/custom';
import DOMDataElement, { reducers as domDataElementReducers } from './dataElementDelegates/dom';
import QueryParamDataElement, { reducers as queryParamReducers } from './dataElementDelegates/queryParam';
import VariableDataElement from './dataElementDelegates/variable';

export default (
  <Router>
    <Route path="/events/blur" component={BlurEvent} reducers={blurEventReducers} onEnter={setBridgeAdapterReducers}/>
    <Route path="/events/click" component={ClickEvent} reducers={clickEventReducers} onEnter={setBridgeAdapterReducers}/>
    <Route path="/events/directCall" component={DirectCallEvent} onEnter={setBridgeAdapterReducers}/>

    <Route path="/conditions/browser" component={BrowserCondition} reducers={browserConditionReducers} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/cartAmount" component={CartAmountCondition} reducers={cartAmountConditionReducers} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/cookie" component={CookieCondition} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/cookieOptOut" component={CookieOptOutCondition} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/custom" component={CustomCondition} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/deviceType" component={DeviceTypeCondition} reducers={deviceTypeConditionReducers} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/domain" component={DomainCondition} reducers={domainConditionReducers} onEnter={setBridgeAdapterReducers}/>
    <Route path="/conditions/urlParameter" component={URLParameterCondition} onEnter={setBridgeAdapterReducers}/>

    <Route path="/dataElements/cookie" component={CookieDataElement} onEnter={setBridgeAdapterReducers}/>
    <Route path="/dataElements/custom" component={CustomDataElement} onEnter={setBridgeAdapterReducers}/>
    <Route path="/dataElements/dom" component={DOMDataElement} reducers={domDataElementReducers} onEnter={setBridgeAdapterReducers}/>
    <Route path="/dataElements/queryParam" component={QueryParamDataElement} reducers={queryParamReducers} onEnter={setBridgeAdapterReducers}/>
    <Route path="/dataElements/variable" component={VariableDataElement} onEnter={setBridgeAdapterReducers}/>
  </Router>
);

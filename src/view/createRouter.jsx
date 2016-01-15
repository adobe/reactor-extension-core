import React from 'react';
import { Router, Route } from 'react-router';

// Events
import BlurEvent, { reducers as blurEventReducers } from './eventDelegates/blur';
import ClickEvent, { reducers as clickEventReducers } from './eventDelegates/click';
import DirectCallEvent from './eventDelegates/directCall';

// Conditions
import BrowserCondition, { reducers as browserConditionReducers } from './conditionDelegates/browser';
import CartAmountCondition, { reducers as cartAmountConditionReducers } from './conditionDelegates/cartAmount';
import CookieCondition from './conditionDelegates/cookie';
import CookieOptOutCondition from './conditionDelegates/cookieOptOut';
import CustomCondition, { reducers as customConditionReducers } from './conditionDelegates/custom';
import DeviceTypeCondition, { reducers as deviceTypeConditionReducers } from './conditionDelegates/deviceType';
import DomainCondition, { reducers as domainConditionReducers } from './conditionDelegates/domain';
import URLParameterCondition from './conditionDelegates/urlParameter';

// Data Elements
import CookieDataElement from './dataElementDelegates/cookie';
import CustomDataElement, { reducers as customDataElementReducers } from './dataElementDelegates/custom';
import DOMDataElement, { reducers as domDataElementReducers } from './dataElementDelegates/dom';
import QueryParameterDataElement, { reducers as queryParameterReducers } from './dataElementDelegates/queryParameter';
import VariableDataElement from './dataElementDelegates/variable';

export default (setBridgeReducers) => {
  const onEnter = (nextState) => {
    setBridgeReducers(nextState.routes[0].reducers);
  };

  return (
    <Router>
      <Route path="/events/blur" component={BlurEvent} reducers={blurEventReducers} onEnter={onEnter}/>
      <Route path="/events/click" component={ClickEvent} reducers={clickEventReducers} onEnter={onEnter}/>
      <Route path="/events/directCall" component={DirectCallEvent} onEnter={onEnter}/>

      <Route path="/conditions/browser" component={BrowserCondition} reducers={browserConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/cartAmount" component={CartAmountCondition} reducers={cartAmountConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/cookie" component={CookieCondition} onEnter={onEnter}/>
      <Route path="/conditions/cookieOptOut" component={CookieOptOutCondition} onEnter={onEnter}/>
      <Route path="/conditions/custom" component={CustomCondition} reducers={customConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/deviceType" component={DeviceTypeCondition} reducers={deviceTypeConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/domain" component={DomainCondition} reducers={domainConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/urlParameter" component={URLParameterCondition} onEnter={onEnter}/>

      <Route path="/dataElements/cookie" component={CookieDataElement} onEnter={onEnter}/>
      <Route path="/dataElements/custom" component={CustomDataElement} reducers={customDataElementReducers} onEnter={onEnter}/>
      <Route path="/dataElements/dom" component={DOMDataElement} reducers={domDataElementReducers} onEnter={onEnter}/>
      <Route path="/dataElements/queryParameter" component={QueryParameterDataElement} reducers={queryParameterReducers} onEnter={onEnter}/>
      <Route path="/dataElements/variable" component={VariableDataElement} onEnter={onEnter}/>
    </Router>
  );
}
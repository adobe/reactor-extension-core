import React from 'react';
import { Router, Route, hashHistory } from 'react-router';

// Events
import ClickEvent, { reducers as clickEventReducers } from './eventDelegates/click';
import DirectCallEvent from './eventDelegates/directCall';
import DomReadyEvent from './eventDelegates/domReady';
import EntersViewportEvent, { reducers as entersViewportEventReducers } from './eventDelegates/entersViewport';
import HoverEvent, { reducers as hoverEventReducers } from './eventDelegates/hover';
import ElementExistsEvent, { reducers as elementExistsEventReducers } from './eventDelegates/blur';
import PageTopEvent from './eventDelegates/pageTop';
import PageBottomEvent from './eventDelegates/pageBottom';
import OnLoadEvent from './eventDelegates/onLoad';
import KeyPressEvent, { reducers as keyPressEventReducers } from './eventDelegates/keyPress';
import FocusEvent, { reducers as focusEventReducers } from './eventDelegates/focus';
import BlurEvent, { reducers as blurEventReducers } from './eventDelegates/blur';
import SubmitEvent, { reducers as submitEventReducers } from './eventDelegates/submit';
import PlayEvent, { reducers as playEventReducers } from './eventDelegates/play';
import PauseEvent, { reducers as pauseEventReducers } from './eventDelegates/pause';
import EndedEvent, { reducers as endedEventReducers } from './eventDelegates/ended';
import VolumeChangeEvent, { reducers as volumeChangeEventReducers } from './eventDelegates/volumeChange';
import StalledEvent, { reducers as stalledEventReducers } from './eventDelegates/stalled';
import LoadedDataEvent, { reducers as loadedDataEventReducers } from './eventDelegates/loadedData';
import TimePlayedEvent, { reducers as timePlayedEventReducers } from './eventDelegates/timePlayed';
import OrientationChangeEvent from './eventDelegates/orientationChange';
import ZoomChangeEvent from './eventDelegates/zoomChange';

// Conditions
import BrowserCondition, { reducers as browserConditionReducers } from './conditionDelegates/browser';
import CartAmountCondition, { reducers as cartAmountConditionReducers } from './conditionDelegates/cartAmount';
import CartItemQuantityCondition, { reducers as cartItemQuantityConditionReducers } from './conditionDelegates/cartItemQuantity';
import CookieCondition from './conditionDelegates/cookie';
import CookieOptOutCondition from './conditionDelegates/cookieOptOut';
import CustomCondition from './conditionDelegates/custom';
import DataElementCondition from './conditionDelegates/dataElement';
import DeviceTypeCondition, { reducers as deviceTypeConditionReducers } from './conditionDelegates/deviceType';
import DomainCondition, { reducers as domainConditionReducers } from './conditionDelegates/domain';
import HashCondition, { reducers as hashConditionReducers } from './conditionDelegates/hash';
import LandingPageCondition from './conditionDelegates/landingPage';
import LoggedInCondition from './conditionDelegates/loggedIn';
import NewReturningCondition, { reducers as newReturningConditionReducers } from './conditionDelegates/newReturning';
import OperatingSystemCondition, { reducers as operatingSystemConditionReducers } from './conditionDelegates/operatingSystem';
import PageViewsCondition, { reducers as pageViewsConditionReducers } from './conditionDelegates/pageViews';
import PathCondition, { reducers as pathConditionReducers } from './conditionDelegates/path';
import PreviousConverterCondition from './conditionDelegates/previousConverter';
import ProtocolCondition, { reducers as protocolReducers } from './conditionDelegates/protocol';
import RegisteredUserCondition from './conditionDelegates/registeredUser';
import ScreenResolutionCondition, { reducers as screenResolutionConditionReducers } from './conditionDelegates/screenResolution';
import SessionsCondition, { reducers as sessionsConditionReducers } from './conditionDelegates/sessions';
import URLParameterCondition from './conditionDelegates/urlParameter';

// Data Elements
import CookieDataElement from './dataElementDelegates/cookie';
import CustomDataElement from './dataElementDelegates/custom';
import DOMDataElement, { reducers as domDataElementReducers } from './dataElementDelegates/dom';
import QueryParameterDataElement, { reducers as queryParameterReducers } from './dataElementDelegates/queryParameter';
import VariableDataElement from './dataElementDelegates/variable';

export default (setBridgeReducers) => {
  const onEnter = (nextState) => {
    setBridgeReducers(nextState.routes[0].reducers);
  };

  return (
    <Router history={hashHistory}>
      <Route path="/events/click" component={ClickEvent} reducers={clickEventReducers} onEnter={onEnter}/>
      <Route path="/events/directCall" component={DirectCallEvent} onEnter={onEnter}/>
      <Route path="/events/domReady" component={DomReadyEvent} onEnter={onEnter}/>
      <Route path="/events/elementExists" component={ElementExistsEvent} reducers={elementExistsEventReducers} onEnter={onEnter}/>
      <Route path="/events/entersViewport" component={EntersViewportEvent} reducers={entersViewportEventReducers} onEnter={onEnter}/>
      <Route path="/events/hover" component={HoverEvent} reducers={hoverEventReducers} onEnter={onEnter}/>
      <Route path="/events/pageTop" component={PageTopEvent} onEnter={onEnter}/>
      <Route path="/events/pageBottom" component={PageBottomEvent} onEnter={onEnter}/>
      <Route path="/events/onLoad" component={OnLoadEvent} onEnter={onEnter}/>
      <Route path="/events/keyPress" component={KeyPressEvent} reducers={keyPressEventReducers} onEnter={onEnter}/>
      <Route path="/events/focus" component={FocusEvent} reducers={focusEventReducers} onEnter={onEnter}/>
      <Route path="/events/blur" component={BlurEvent} reducers={blurEventReducers} onEnter={onEnter}/>
      <Route path="/events/submit" component={SubmitEvent} reducers={submitEventReducers} onEnter={onEnter}/>
      <Route path="/events/play" component={PlayEvent} reducers={playEventReducers} onEnter={onEnter}/>
      <Route path="/events/pause" component={PauseEvent} reducers={pauseEventReducers} onEnter={onEnter}/>
      <Route path="/events/ended" component={EndedEvent} reducers={endedEventReducers} onEnter={onEnter}/>
      <Route path="/events/volumeChange" component={VolumeChangeEvent} reducers={volumeChangeEventReducers} onEnter={onEnter}/>
      <Route path="/events/stalled" component={StalledEvent} reducers={stalledEventReducers} onEnter={onEnter}/>
      <Route path="/events/loadedData" component={LoadedDataEvent} reducers={loadedDataEventReducers} onEnter={onEnter}/>
      <Route path="/events/timePlayed" component={TimePlayedEvent} reducers={timePlayedEventReducers} onEnter={onEnter}/>
      <Route path="/events/orientationChange" component={OrientationChangeEvent} onEnter={onEnter}/>
      <Route path="/events/zoomChange" component={ZoomChangeEvent} onEnter={onEnter}/>

      <Route path="/conditions/browser" component={BrowserCondition} reducers={browserConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/cartAmount" component={CartAmountCondition} reducers={cartAmountConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/cartItemQuantity" component={CartItemQuantityCondition} reducers={cartItemQuantityConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/cookie" component={CookieCondition} onEnter={onEnter}/>
      <Route path="/conditions/cookieOptOut" component={CookieOptOutCondition} onEnter={onEnter}/>
      <Route path="/conditions/custom" component={CustomCondition} onEnter={onEnter}/>
      <Route path="/conditions/dataElement" component={DataElementCondition} onEnter={onEnter}/>
      <Route path="/conditions/deviceType" component={DeviceTypeCondition} reducers={deviceTypeConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/domain" component={DomainCondition} reducers={domainConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/hash" component={HashCondition} reducers={hashConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/landingPage" component={LandingPageCondition} onEnter={onEnter}/>
      <Route path="/conditions/loggedIn" component={LoggedInCondition} onEnter={onEnter}/>
      <Route path="/conditions/newReturning" component={NewReturningCondition} reducers={newReturningConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/operatingSystem" component={OperatingSystemCondition} reducers={operatingSystemConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/pageViews" component={PageViewsCondition} reducers={pageViewsConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/path" component={PathCondition} reducers={pathConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/previousConverter" component={PreviousConverterCondition} onEnter={onEnter}/>
      <Route path="/conditions/protocol" component={ProtocolCondition} reducers={protocolReducers} onEnter={onEnter}/>
      <Route path="/conditions/registeredUser" component={RegisteredUserCondition} onEnter={onEnter}/>
      <Route path="/conditions/screenResolution" component={ScreenResolutionCondition} reducers={screenResolutionConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/sessions" component={SessionsCondition} reducers={sessionsConditionReducers} onEnter={onEnter}/>
      <Route path="/conditions/urlParameter" component={URLParameterCondition} onEnter={onEnter}/>

      <Route path="/dataElements/cookie" component={CookieDataElement} onEnter={onEnter}/>
      <Route path="/dataElements/custom" component={CustomDataElement} onEnter={onEnter}/>
      <Route path="/dataElements/dom" component={DOMDataElement} reducers={domDataElementReducers} onEnter={onEnter}/>
      <Route path="/dataElements/queryParameter" component={QueryParameterDataElement} reducers={queryParameterReducers} onEnter={onEnter}/>
      <Route path="/dataElements/variable" component={VariableDataElement} onEnter={onEnter}/>
    </Router>
  );
}

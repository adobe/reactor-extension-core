/*eslint max-len: [2, 200, 4]*/
import React from 'react';
import { Router, Route, hashHistory } from 'react-router';

// Events
import BlurEvent from './eventDelegates/blur';
import ClickEvent from './eventDelegates/click';
import DirectCallEvent from './eventDelegates/directCall';
import DomReadyEvent from './eventDelegates/domReady';
import ElementExistsEvent from './eventDelegates/elementExists';
import EndedEvent from './eventDelegates/ended';
import EntersViewportEvent from './eventDelegates/entersViewport';
import FocusEvent from './eventDelegates/focus';
import HoverEvent from './eventDelegates/hover';
import KeyPressEvent from './eventDelegates/keyPress';
import LoadedDataEvent from './eventDelegates/loadedData';
import LocationChangeEvent from './eventDelegates/locationChange';
import OnLoadEvent from './eventDelegates/onLoad';
import OrientationChangeEvent from './eventDelegates/orientationChange';
import PageBottomEvent from './eventDelegates/pageBottom';
import PageTopEvent from './eventDelegates/pageTop';
import PauseEvent from './eventDelegates/pause';
import PlayEvent from './eventDelegates/play';
import StalledEvent from './eventDelegates/stalled';
import SubmitEvent from './eventDelegates/submit';
import TabBlurEvent from './eventDelegates/tabBlur';
import TabFocusEvent from './eventDelegates/tabFocus';
import TimePlayedEvent from './eventDelegates/timePlayed';
import VolumeChangeEvent from './eventDelegates/volumeChange';
import ZoomChangeEvent from './eventDelegates/zoomChange';

// Conditions
import BrowserCondition from './conditionDelegates/browser';
import CartAmountCondition from './conditionDelegates/cartAmount';
import CartItemQuantityCondition from './conditionDelegates/cartItemQuantity';
import CookieCondition from './conditionDelegates/cookie';
import CookieOptOutCondition from './conditionDelegates/cookieOptOut';
import CustomCondition from './conditionDelegates/custom';
import DataElementCondition from './conditionDelegates/dataElement';
import DeviceTypeCondition from './conditionDelegates/deviceType';
import DomainCondition from './conditionDelegates/domain';
import HashCondition from './conditionDelegates/hash';
import LandingPageCondition from './conditionDelegates/landingPage';
import LoggedInCondition from './conditionDelegates/loggedIn';
import NewReturningCondition from './conditionDelegates/newReturning';
import OperatingSystemCondition from './conditionDelegates/operatingSystem';
import PageViewsCondition from './conditionDelegates/pageViews';
import PathCondition from './conditionDelegates/path';
import PreviousConverterCondition from './conditionDelegates/previousConverter';
import ProtocolCondition from './conditionDelegates/protocol';
import RegisteredUserCondition from './conditionDelegates/registeredUser';
import ScreenResolutionCondition from './conditionDelegates/screenResolution';
import SessionsCondition from './conditionDelegates/sessions';
import URLParameterCondition from './conditionDelegates/urlParameter';
import SubdomainCondition from './conditionDelegates/subdomain';
import TimeOnSiteCondition from './conditionDelegates/timeOnSite';
import TrafficSourceCondition from './conditionDelegates/trafficSource';
import WindowSizeCondition from './conditionDelegates/windowSize';

// Data Elements
import CookieDataElement from './dataElementDelegates/cookie';
import CustomDataElement from './dataElementDelegates/custom';
import DOMDataElement from './dataElementDelegates/dom';
import QueryParameterDataElement from './dataElementDelegates/queryParameter';
import VariableDataElement from './dataElementDelegates/variable';

export default (setFormConfigForCurrentRoute) => {
  const onEnter = nextState => {
    setFormConfigForCurrentRoute(nextState.routes[0].component.formConfig);
  };

  return (
    <Router history={hashHistory}>
      <Route path="/events/blur" component={BlurEvent} onEnter={onEnter}/>
      <Route path="/events/click" component={ClickEvent} onEnter={onEnter}/>
      <Route path="/events/directCall" component={DirectCallEvent} onEnter={onEnter}/>
      <Route path="/events/domReady" component={DomReadyEvent} onEnter={onEnter}/>
      <Route path="/events/elementExists" component={ElementExistsEvent} onEnter={onEnter}/>
      <Route path="/events/ended" component={EndedEvent} onEnter={onEnter}/>
      <Route path="/events/entersViewport" component={EntersViewportEvent} onEnter={onEnter}/>
      <Route path="/events/focus" component={FocusEvent} onEnter={onEnter}/>
      <Route path="/events/hover" component={HoverEvent} onEnter={onEnter}/>
      <Route path="/events/keyPress" component={KeyPressEvent} onEnter={onEnter}/>
      <Route path="/events/loadedData" component={LoadedDataEvent} onEnter={onEnter}/>
      <Route path="/events/locationChange" component={LocationChangeEvent} onEnter={onEnter}/>
      <Route path="/events/onLoad" component={OnLoadEvent} onEnter={onEnter}/>
      <Route path="/events/orientationChange" component={OrientationChangeEvent} onEnter={onEnter}/>
      <Route path="/events/pageBottom" component={PageBottomEvent} onEnter={onEnter}/>
      <Route path="/events/pageTop" component={PageTopEvent} onEnter={onEnter}/>
      <Route path="/events/pause" component={PauseEvent} onEnter={onEnter}/>
      <Route path="/events/play" component={PlayEvent} onEnter={onEnter}/>
      <Route path="/events/stalled" component={StalledEvent} onEnter={onEnter}/>
      <Route path="/events/submit" component={SubmitEvent} onEnter={onEnter}/>
      <Route path="/events/tabBlur" component={TabBlurEvent} onEnter={onEnter}/>
      <Route path="/events/tabFocus" component={TabFocusEvent} onEnter={onEnter}/>
      <Route path="/events/timePlayed" component={TimePlayedEvent} onEnter={onEnter}/>
      <Route path="/events/volumeChange" component={VolumeChangeEvent} onEnter={onEnter}/>
      <Route path="/events/zoomChange" component={ZoomChangeEvent} onEnter={onEnter}/>

      <Route path="/conditions/browser" component={BrowserCondition} onEnter={onEnter}/>
      <Route path="/conditions/cartAmount" component={CartAmountCondition} onEnter={onEnter}/>
      <Route path="/conditions/cartItemQuantity" component={CartItemQuantityCondition} onEnter={onEnter}/>
      <Route path="/conditions/cookie" component={CookieCondition} onEnter={onEnter}/>
      <Route path="/conditions/cookieOptOut" component={CookieOptOutCondition} onEnter={onEnter}/>
      <Route path="/conditions/custom" component={CustomCondition} onEnter={onEnter}/>
      <Route path="/conditions/dataElement" component={DataElementCondition} onEnter={onEnter}/>
      <Route path="/conditions/deviceType" component={DeviceTypeCondition} onEnter={onEnter}/>
      <Route path="/conditions/domain" component={DomainCondition} onEnter={onEnter}/>
      <Route path="/conditions/hash" component={HashCondition} onEnter={onEnter}/>
      <Route path="/conditions/landingPage" component={LandingPageCondition} onEnter={onEnter}/>
      <Route path="/conditions/loggedIn" component={LoggedInCondition} onEnter={onEnter}/>
      <Route path="/conditions/newReturning" component={NewReturningCondition} onEnter={onEnter}/>
      <Route path="/conditions/operatingSystem" component={OperatingSystemCondition} onEnter={onEnter}/>
      <Route path="/conditions/pageViews" component={PageViewsCondition} onEnter={onEnter}/>
      <Route path="/conditions/path" component={PathCondition} onEnter={onEnter}/>
      <Route path="/conditions/previousConverter" component={PreviousConverterCondition} onEnter={onEnter}/>
      <Route path="/conditions/protocol" component={ProtocolCondition} onEnter={onEnter}/>
      <Route path="/conditions/registeredUser" component={RegisteredUserCondition} onEnter={onEnter}/>
      <Route path="/conditions/screenResolution" component={ScreenResolutionCondition} onEnter={onEnter}/>
      <Route path="/conditions/sessions" component={SessionsCondition} onEnter={onEnter}/>
      <Route path="/conditions/urlParameter" component={URLParameterCondition} onEnter={onEnter}/>
      <Route path="/conditions/subdomain" component={SubdomainCondition} onEnter={onEnter}/>
      <Route path="/conditions/timeOnSite" component={TimeOnSiteCondition} onEnter={onEnter}/>
      <Route path="/conditions/trafficSource" component={TrafficSourceCondition} onEnter={onEnter}/>
      <Route path="/conditions/windowSize" component={WindowSizeCondition} onEnter={onEnter}/>

      <Route path="/dataElements/cookie" component={CookieDataElement} onEnter={onEnter}/>
      <Route path="/dataElements/custom" component={CustomDataElement} onEnter={onEnter}/>
      <Route path="/dataElements/dom" component={DOMDataElement} onEnter={onEnter}/>
      <Route path="/dataElements/queryParameter" component={QueryParameterDataElement} onEnter={onEnter}/>
      <Route path="/dataElements/variable" component={VariableDataElement} onEnter={onEnter}/>
    </Router>
  );
};

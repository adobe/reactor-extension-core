/* eslint max-len: [2, 200, 4]*/
import React from 'react';
import { Router, Route, hashHistory } from 'react-router';

// Events
import BlurEvent from './events/blur';
import CustomEvent from './events/custom';
import ClickEvent from './events/click';
import DataElementChanged from './events/dataElementChanged';
import DirectCallEvent from './events/directCall';
import DomReadyEvent from './events/domReady';
import ElementExistsEvent from './events/elementExists';
import EndedEvent from './events/ended';
import EntersViewportEvent from './events/entersViewport';
import FocusEvent from './events/focus';
import HoverEvent from './events/hover';
import KeyPressEvent from './events/keyPress';
import LoadedDataEvent from './events/loadedData';
import LocationChangeEvent from './events/locationChange';
import OnLoadEvent from './events/onLoad';
import OrientationChangeEvent from './events/orientationChange';
import PageBottomEvent from './events/pageBottom';
import PageTopEvent from './events/pageTop';
import PauseEvent from './events/pause';
import PlayEvent from './events/play';
import StalledEvent from './events/stalled';
import SubmitEvent from './events/submit';
import TabBlurEvent from './events/tabBlur';
import TabFocusEvent from './events/tabFocus';
import TimePlayedEvent from './events/timePlayed';
import TimeSpentOnPageEvent from './events/timeSpentOnPage';
import VolumeChangeEvent from './events/volumeChange';
import ZoomChangeEvent from './events/zoomChange';

// Conditions
import BrowserCondition from './conditions/browser';
import CartAmountCondition from './conditions/cartAmount';
import CartItemQuantityCondition from './conditions/cartItemQuantity';
import CookieCondition from './conditions/cookie';
import CookieOptOutCondition from './conditions/cookieOptOut';
import CustomCondition from './conditions/custom';
import DataElementCondition from './conditions/dataElement';
import DeviceTypeCondition from './conditions/deviceType';
import DomainCondition from './conditions/domain';
import HashCondition from './conditions/hash';
import LandingPageCondition from './conditions/landingPage';
import LoggedInCondition from './conditions/loggedIn';
import NewReturningCondition from './conditions/newReturning';
import OperatingSystemCondition from './conditions/operatingSystem';
import PageViewsCondition from './conditions/pageViews';
import PathCondition from './conditions/path';
import PreviousConverterCondition from './conditions/previousConverter';
import ProtocolCondition from './conditions/protocol';
import RegisteredUserCondition from './conditions/registeredUser';
import ScreenResolutionCondition from './conditions/screenResolution';
import SessionsCondition from './conditions/sessions';
import URLParameterCondition from './conditions/urlParameter';
import SubdomainCondition from './conditions/subdomain';
import TimeOnSiteCondition from './conditions/timeOnSite';
import TrafficSourceCondition from './conditions/trafficSource';
import VariableCondition from './conditions/variable';
import WindowSizeCondition from './conditions/windowSize';

// Data Elements
import CookieDataElement from './dataElements/cookie';
import CustomDataElement from './dataElements/custom';
import DOMDataElement from './dataElements/dom';
import QueryParameterDataElement from './dataElements/queryParameter';
import VariableDataElement from './dataElements/variable';

// Actions
import CustomAction from './actions/custom';

export default (setFormConfigForCurrentRoute) => {
  const onEnter = nextState => {
    setFormConfigForCurrentRoute(nextState.routes[0].component.formConfig);
  };

  return (
    <Router history={ hashHistory }>
      <Route path="/events/blur" component={ BlurEvent } onEnter={ onEnter } />
      <Route path="/events/click" component={ ClickEvent } onEnter={ onEnter } />
      <Route path="/events/custom" component={ CustomEvent } onEnter={ onEnter } />
      <Route path="/events/dataElementChanged" component={ DataElementChanged } onEnter={ onEnter } />
      <Route path="/events/directCall" component={ DirectCallEvent } onEnter={ onEnter } />
      <Route path="/events/domReady" component={ DomReadyEvent } onEnter={ onEnter } />
      <Route path="/events/elementExists" component={ ElementExistsEvent } onEnter={ onEnter } />
      <Route path="/events/ended" component={ EndedEvent } onEnter={ onEnter } />
      <Route path="/events/entersViewport" component={ EntersViewportEvent } onEnter={ onEnter } />
      <Route path="/events/focus" component={ FocusEvent } onEnter={ onEnter } />
      <Route path="/events/hover" component={ HoverEvent } onEnter={ onEnter } />
      <Route path="/events/keyPress" component={ KeyPressEvent } onEnter={ onEnter } />
      <Route path="/events/loadedData" component={ LoadedDataEvent } onEnter={ onEnter } />
      <Route path="/events/locationChange" component={ LocationChangeEvent } onEnter={ onEnter } />
      <Route path="/events/onLoad" component={ OnLoadEvent } onEnter={ onEnter } />
      <Route path="/events/orientationChange" component={ OrientationChangeEvent } onEnter={ onEnter } />
      <Route path="/events/pageBottom" component={ PageBottomEvent } onEnter={ onEnter } />
      <Route path="/events/pageTop" component={ PageTopEvent } onEnter={ onEnter } />
      <Route path="/events/pause" component={ PauseEvent } onEnter={ onEnter } />
      <Route path="/events/play" component={ PlayEvent } onEnter={ onEnter } />
      <Route path="/events/stalled" component={ StalledEvent } onEnter={ onEnter } />
      <Route path="/events/submit" component={ SubmitEvent } onEnter={ onEnter } />
      <Route path="/events/tabBlur" component={ TabBlurEvent } onEnter={ onEnter } />
      <Route path="/events/tabFocus" component={ TabFocusEvent } onEnter={ onEnter } />
      <Route path="/events/timePlayed" component={ TimePlayedEvent } onEnter={ onEnter } />
      <Route path="/events/timeSpentOnPage" component={ TimeSpentOnPageEvent } onEnter={ onEnter } />
      <Route path="/events/volumeChange" component={ VolumeChangeEvent } onEnter={ onEnter } />
      <Route path="/events/zoomChange" component={ ZoomChangeEvent } onEnter={ onEnter } />

      <Route path="/conditions/browser" component={ BrowserCondition } onEnter={ onEnter } />
      <Route path="/conditions/cartAmount" component={ CartAmountCondition } onEnter={ onEnter } />
      <Route path="/conditions/cartItemQuantity" component={ CartItemQuantityCondition } onEnter={ onEnter } />
      <Route path="/conditions/cookie" component={ CookieCondition } onEnter={ onEnter } />
      <Route path="/conditions/cookieOptOut" component={ CookieOptOutCondition } onEnter={ onEnter } />
      <Route path="/conditions/custom" component={ CustomCondition } onEnter={ onEnter } />
      <Route path="/conditions/dataElement" component={ DataElementCondition } onEnter={ onEnter } />
      <Route path="/conditions/deviceType" component={ DeviceTypeCondition } onEnter={ onEnter } />
      <Route path="/conditions/domain" component={ DomainCondition } onEnter={ onEnter } />
      <Route path="/conditions/hash" component={ HashCondition } onEnter={ onEnter } />
      <Route path="/conditions/landingPage" component={ LandingPageCondition } onEnter={ onEnter } />
      <Route path="/conditions/loggedIn" component={ LoggedInCondition } onEnter={ onEnter } />
      <Route path="/conditions/newReturning" component={ NewReturningCondition } onEnter={ onEnter } />
      <Route path="/conditions/operatingSystem" component={ OperatingSystemCondition } onEnter={ onEnter } />
      <Route path="/conditions/pageViews" component={ PageViewsCondition } onEnter={ onEnter } />
      <Route path="/conditions/path" component={ PathCondition } onEnter={ onEnter } />
      <Route path="/conditions/previousConverter" component={ PreviousConverterCondition } onEnter={ onEnter } />
      <Route path="/conditions/protocol" component={ ProtocolCondition } onEnter={ onEnter } />
      <Route path="/conditions/registeredUser" component={ RegisteredUserCondition } onEnter={ onEnter } />
      <Route path="/conditions/screenResolution" component={ ScreenResolutionCondition } onEnter={ onEnter } />
      <Route path="/conditions/sessions" component={ SessionsCondition } onEnter={ onEnter } />
      <Route path="/conditions/urlParameter" component={ URLParameterCondition } onEnter={ onEnter } />
      <Route path="/conditions/subdomain" component={ SubdomainCondition } onEnter={ onEnter } />
      <Route path="/conditions/timeOnSite" component={ TimeOnSiteCondition } onEnter={ onEnter } />
      <Route path="/conditions/trafficSource" component={ TrafficSourceCondition } onEnter={ onEnter } />
      <Route path="/conditions/variable" component={ VariableCondition } onEnter={ onEnter } />
      <Route path="/conditions/windowSize" component={ WindowSizeCondition } onEnter={ onEnter } />

      <Route path="/dataElements/cookie" component={ CookieDataElement } onEnter={ onEnter } />
      <Route path="/dataElements/custom" component={ CustomDataElement } onEnter={ onEnter } />
      <Route path="/dataElements/dom" component={ DOMDataElement } onEnter={ onEnter } />
      <Route path="/dataElements/queryParameter" component={ QueryParameterDataElement } onEnter={ onEnter } />
      <Route path="/dataElements/variable" component={ VariableDataElement } onEnter={ onEnter } />

      <Route path="/actions/custom" component={ CustomAction } onEnter={ onEnter } />
    </Router>
  );
};

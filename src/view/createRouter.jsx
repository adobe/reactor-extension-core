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

const componentsByPath = {
  '/events/blur': BlurEvent,
  '/events/click': ClickEvent,
  '/events/custom': CustomEvent,
  '/events/dataElementChanged': DataElementChanged,
  '/events/directCall': DirectCallEvent,
  '/events/domReady': DomReadyEvent,
  '/events/elementExists': ElementExistsEvent,
  '/events/ended': EndedEvent,
  '/events/entersViewport': EntersViewportEvent,
  '/events/focus': FocusEvent,
  '/events/hover': HoverEvent,
  '/events/keyPress': KeyPressEvent,
  '/events/loadedData': LoadedDataEvent,
  '/events/locationChange': LocationChangeEvent,
  '/events/onLoad': OnLoadEvent,
  '/events/orientationChange': OrientationChangeEvent,
  '/events/pageBottom': PageBottomEvent,
  '/events/pageTop': PageTopEvent,
  '/events/pause': PauseEvent,
  '/events/play': PlayEvent,
  '/events/stalled': StalledEvent,
  '/events/submit': SubmitEvent,
  '/events/tabBlur': TabBlurEvent,
  '/events/tabFocus': TabFocusEvent,
  '/events/timePlayed': TimePlayedEvent,
  '/events/timeSpentOnPage': TimeSpentOnPageEvent,
  '/events/volumeChange': VolumeChangeEvent,
  '/events/zoomChange': ZoomChangeEvent,
  '/conditions/browser': BrowserCondition,
  '/conditions/cartAmount': CartAmountCondition,
  '/conditions/cartItemQuantity': CartItemQuantityCondition,
  '/conditions/cookie': CookieCondition,
  '/conditions/cookieOptOut': CookieOptOutCondition,
  '/conditions/custom': CustomCondition,
  '/conditions/dataElement': DataElementCondition,
  '/conditions/deviceType': DeviceTypeCondition,
  '/conditions/domain': DomainCondition,
  '/conditions/hash': HashCondition,
  '/conditions/landingPage': LandingPageCondition,
  '/conditions/loggedIn': LoggedInCondition,
  '/conditions/newReturning': NewReturningCondition,
  '/conditions/operatingSystem': OperatingSystemCondition,
  '/conditions/pageViews': PageViewsCondition,
  '/conditions/path': PathCondition,
  '/conditions/previousConverter': PreviousConverterCondition,
  '/conditions/protocol': ProtocolCondition,
  '/conditions/registeredUser': RegisteredUserCondition,
  '/conditions/screenResolution': ScreenResolutionCondition,
  '/conditions/sessions': SessionsCondition,
  '/conditions/urlParameter': URLParameterCondition,
  '/conditions/subdomain': SubdomainCondition,
  '/conditions/timeOnSite': TimeOnSiteCondition,
  '/conditions/trafficSource': TrafficSourceCondition,
  '/conditions/variable': VariableCondition,
  '/conditions/windowSize': WindowSizeCondition,
  '/dataElements/cookie': CookieDataElement,
  '/dataElements/custom': CustomDataElement,
  '/dataElements/dom': DOMDataElement,
  '/dataElements/queryParameter': QueryParameterDataElement,
  '/dataElements/variable': VariableDataElement,
  '/actions/custom': CustomAction
};

export default (setFormConfigForCurrentRoute) => {
  const onEnter = (nextState) => {
    setFormConfigForCurrentRoute(nextState.routes[0].component.formConfig);
  };

  const routes = Object.keys(componentsByPath).map(path =>
    <Route
      key={ path }
      path={ path }
      component={ componentsByPath[path] }
      onEnter={ onEnter }
    />
  );

  return <Router history={ hashHistory }>{ routes }</Router>;
};

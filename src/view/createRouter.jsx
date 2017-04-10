/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/* eslint max-len: [2, 200, 4]*/
import React from 'react';
import { Router, Route, hashHistory } from 'react-router';

// Events
import BlurEvent from './events/blur';
import CustomCodeEvent from './events/customCode';
import CustomEventEvent from './events/customEvent';
import ClickEvent from './events/click';
import DataElementChanged from './events/dataElementChanged';
import DirectCallEvent from './events/directCall';
import ElementExistsEvent from './events/elementExists';
import EndedEvent from './events/ended';
import EntersViewportEvent from './events/entersViewport';
import FocusEvent from './events/focus';
import HoverEvent from './events/hover';
import KeyPressEvent from './events/keyPress';
import LoadedDataEvent from './events/loadedData';
import PauseEvent from './events/pause';
import PlayEvent from './events/play';
import StalledEvent from './events/stalled';
import SubmitEvent from './events/submit';
import TimePlayedEvent from './events/timePlayed';
import TimeSpentOnPageEvent from './events/timeSpentOnPage';
import VolumeChangeEvent from './events/volumeChange';

// Conditions
import BrowserCondition from './conditions/browser';
import CartAmountCondition from './conditions/cartAmount';
import CartItemQuantityCondition from './conditions/cartItemQuantity';
import CookieCondition from './conditions/cookie';
import CookieOptOutCondition from './conditions/cookieOptOut';
import CustomCodeCondition from './conditions/customCode';
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
import PathAndQueryStringCondition from './conditions/pathAndQueryString';
import PreviousConverterCondition from './conditions/previousConverter';
import ProtocolCondition from './conditions/protocol';
import RegisteredUserCondition from './conditions/registeredUser';
import ScreenResolutionCondition from './conditions/screenResolution';
import SessionsCondition from './conditions/sessions';
import QueryStringParameterCondition from './conditions/queryStringParameter';
import SubdomainCondition from './conditions/subdomain';
import TimeOnSiteCondition from './conditions/timeOnSite';
import TrafficSourceCondition from './conditions/trafficSource';
import VariableCondition from './conditions/variable';
import WindowSizeCondition from './conditions/windowSize';

// Data Elements
import CookieDataElement from './dataElements/cookie';
import CustomCodeDataElement from './dataElements/customCode';
import DOMDataElement from './dataElements/dom';
import LocalStorage from './dataElements/localStorage';
import QueryStringParameterDataElement from './dataElements/queryStringParameter';
import VariableDataElement from './dataElements/variable';

// Actions
import CustomCodeAction from './actions/customCode';

const componentsByPath = {
  '/events/blur': BlurEvent,
  '/events/click': ClickEvent,
  '/events/customCode': CustomCodeEvent,
  '/events/customEvent': CustomEventEvent,
  '/events/dataElementChanged': DataElementChanged,
  '/events/directCall': DirectCallEvent,
  '/events/elementExists': ElementExistsEvent,
  '/events/ended': EndedEvent,
  '/events/entersViewport': EntersViewportEvent,
  '/events/focus': FocusEvent,
  '/events/hover': HoverEvent,
  '/events/keyPress': KeyPressEvent,
  '/events/loadedData': LoadedDataEvent,
  '/events/pause': PauseEvent,
  '/events/play': PlayEvent,
  '/events/stalled': StalledEvent,
  '/events/submit': SubmitEvent,
  '/events/timePlayed': TimePlayedEvent,
  '/events/timeSpentOnPage': TimeSpentOnPageEvent,
  '/events/volumeChange': VolumeChangeEvent,
  '/conditions/browser': BrowserCondition,
  '/conditions/cartAmount': CartAmountCondition,
  '/conditions/cartItemQuantity': CartItemQuantityCondition,
  '/conditions/cookie': CookieCondition,
  '/conditions/cookieOptOut': CookieOptOutCondition,
  '/conditions/customCode': CustomCodeCondition,
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
  '/conditions/pathAndQueryString': PathAndQueryStringCondition,
  '/conditions/previousConverter': PreviousConverterCondition,
  '/conditions/protocol': ProtocolCondition,
  '/conditions/registeredUser': RegisteredUserCondition,
  '/conditions/screenResolution': ScreenResolutionCondition,
  '/conditions/sessions': SessionsCondition,
  '/conditions/queryStringParameter': QueryStringParameterCondition,
  '/conditions/subdomain': SubdomainCondition,
  '/conditions/timeOnSite': TimeOnSiteCondition,
  '/conditions/trafficSource': TrafficSourceCondition,
  '/conditions/variable': VariableCondition,
  '/conditions/windowSize': WindowSizeCondition,
  '/dataElements/cookie': CookieDataElement,
  '/dataElements/customCode': CustomCodeDataElement,
  '/dataElements/dom': DOMDataElement,
  '/dataElements/localStorage': LocalStorage,
  '/dataElements/queryStringParameter': QueryStringParameterDataElement,
  '/dataElements/variable': VariableDataElement,
  '/actions/customCode': CustomCodeAction
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

/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import once from './helpers/once';
import visibilityApiFactory from './helpers/visibilityApi';
import { castToNumberIfString } from '../helpers/stringAndNumberUtils';

function createTimeOnPageDelegate(Timer, document) {
  const visibilityApi = visibilityApiFactory();
  const hiddenProperty = visibilityApi.hiddenProperty;
  const visibilityChangeEventType = visibilityApi.visibilityChangeEventType;
  const triggers = {};

  const onMarkerPassed = function (timeOnPageMilliseconds) {
    const syntheticEvent = {
      timeOnPage: timeOnPageMilliseconds / 1000
    };
    triggers[timeOnPageMilliseconds].forEach(function (trigger) {
      trigger(syntheticEvent);
    });
  };

  const setupTimer = once(function () {
    const timer = new Timer();
    timer.on('markerPassed', onMarkerPassed);
    document.addEventListener(
      visibilityChangeEventType,
      function () {
        if (document[hiddenProperty]) {
          timer.pause();
        } else {
          timer.resume();
        }
      },
      true
    );
  });

  return function (settings, trigger) {
    const timeOnPageMilliseconds =
      castToNumberIfString(settings.timeOnPage) * 1000;
    if (!triggers[timeOnPageMilliseconds]) {
      triggers[timeOnPageMilliseconds] = [];
    }
    triggers[timeOnPageMilliseconds].push(trigger);
    setupTimer();
  };
}

export default createTimeOnPageDelegate;

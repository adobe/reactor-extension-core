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
import validateInjectedParams from '../../helpers/validate-injected-params.js';

function injectZoomChange({ window, document }) {
  const triggers = [];

  const getCurrentZoom = function () {
    return document.documentElement.clientWidth / window.innerWidth;
  };

  const callTriggers = function (event) {
    triggers.forEach(function (trigger) {
      trigger(event);
    });
  };

  const watchForZoom = once(function () {
    if (!('ongestureend' in window) || !('ontouchend' in window)) {
      return;
    }

    let lastZoom = getCurrentZoom();
    let gestureEndTime;
    const delayFire = 1000;
    let currentTimer;

    document.addEventListener('gestureend', function () {
      gestureEndTime = +new Date();

      // Could we use a generic throttling or debouncing function?
      setTimeout(function () {
        let zoom = getCurrentZoom();

        if (zoom === lastZoom) {
          return;
        }

        lastZoom = zoom;

        if (currentTimer) {
          clearTimeout(currentTimer);
        }

        currentTimer = setTimeout(function () {
          currentTimer = null;

          zoom = getCurrentZoom();

          if (lastZoom === zoom) {
            callTriggers({
              method: 'pinch',
              zoom: zoom.toFixed(2)
            });
          }
        }, delayFire);
      }, 50);
    });

    document.addEventListener('touchend', function () {
      if (gestureEndTime && +new Date() - gestureEndTime < 50) {
        return;
      }

      // Could we use a generic throttling or debouncing function?
      setTimeout(function () {
        let zoom = getCurrentZoom();

        if (zoom === lastZoom) {
          return;
        }

        lastZoom = zoom;

        if (currentTimer) {
          clearTimeout(currentTimer);
        }

        currentTimer = setTimeout(function () {
          currentTimer = null;
          zoom = getCurrentZoom();
          if (lastZoom === zoom) {
            callTriggers({
              method: 'double tap',
              zoom: zoom.toFixed(2)
            });
          }
        }, delayFire);
      }, 250);
    });
  });

  /**
   * The zoomchange event. This event occurs when the zoom level has changed on an iOS device.
   * This is unsupported on Android.
   * @param {Object} settings The event settings object.
   * @param {ruleTrigger} trigger The trigger callback.
   */
  return function zoomChange(settings, trigger) {
    watchForZoom();
    triggers.push(trigger);
  };
}

const validateInjection = validateInjectedParams(injectZoomChange);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  window: require('@adobe/reactor-window'),
  document: require('@adobe/reactor-document')
});

/* START.TESTS_ONLY */
export { validateInjection as injectZoomChange };
/* END.TESTS_ONLY */

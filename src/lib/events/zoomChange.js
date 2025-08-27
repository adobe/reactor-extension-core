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

function createZoomChangeDelegate(window, document) {
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
      setTimeout(function () {
        const zoom = getCurrentZoom();
        if (zoom === lastZoom) {
          return;
        }
        lastZoom = zoom;
        callTriggers({ method: 'gestureend', zoom: zoom });
      }, delayFire);
    });

    window.addEventListener('resize', function () {
      const zoom = getCurrentZoom();
      if (zoom === lastZoom) {
        return;
      }
      lastZoom = zoom;
      callTriggers({ method: 'resize', zoom: zoom });
    });
  });

  return function (settings, trigger) {
    triggers.push(trigger);
    watchForZoom();
  };
}

export default createZoomChangeDelegate;

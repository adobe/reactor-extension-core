/***************************************************************************************
 * (c) 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

function createPageLifecycleEvents(window, document) {
  var isIE10 = window.navigator.appVersion.indexOf('MSIE 10') !== -1;
  var WINDOW_LOADED = 'WINDOW_LOADED';
  var DOM_READY = 'DOM_READY';
  var PAGE_BOTTOM = 'PAGE_BOTTOM';

  var lifecycleEventsOrder = [PAGE_BOTTOM, DOM_READY, WINDOW_LOADED];

  var createSyntheticEvent = function (element, nativeEvent) {
    return {
      element: element,
      target: element,
      nativeEvent: nativeEvent
    };
  };

  var registry = {};
  lifecycleEventsOrder.forEach(function (event) {
    registry[event] = [];
  });

  var processRegistry = function (lifecycleEvent, nativeEvent) {
    lifecycleEventsOrder
      .slice(0, getLifecycleEventIndex(lifecycleEvent) + 1)
      .forEach(function (lifecycleEvent) {
        processTriggers(nativeEvent, lifecycleEvent);
      });
  };

  var detectLifecycleEvent = function () {
    if (document.readyState === 'complete') {
      return WINDOW_LOADED;
    } else if (document.readyState === 'interactive') {
      return !isIE10 ? DOM_READY : null;
    }
  };

  var getLifecycleEventIndex = function (event) {
    return lifecycleEventsOrder.indexOf(event);
  };

  var processTriggers = function (nativeEvent, lifecycleEvent) {
    registry[lifecycleEvent].forEach(function (triggerData) {
      processTrigger(nativeEvent, triggerData);
    });
    registry[lifecycleEvent] = [];
  };

  var processTrigger = function (nativeEvent, triggerData) {
    var trigger = triggerData.trigger;
    var syntheticEventFn = triggerData.syntheticEventFn;

    trigger(syntheticEventFn ? syntheticEventFn(nativeEvent) : null);
  };

  window._satellite = window._satellite || {};
  window._satellite.pageBottom = processRegistry.bind(null, PAGE_BOTTOM);

  document.addEventListener(
    'DOMContentLoaded',
    processRegistry.bind(null, DOM_READY),
    true
  );
  window.addEventListener(
    'load',
    processRegistry.bind(null, WINDOW_LOADED),
    true
  );

  window.setTimeout(function () {
    var lifecycleEvent = detectLifecycleEvent();
    if (lifecycleEvent) {
      processRegistry(lifecycleEvent);
    }
  }, 0);

  return {
    registerLibraryLoadedTrigger: function (trigger) {
      trigger();
    },
    registerPageBottomTrigger: function (trigger) {
      registry[PAGE_BOTTOM].push({
        trigger: trigger
      });
    },
    registerDomReadyTrigger: function (trigger) {
      registry[DOM_READY].push({
        trigger: trigger,
        syntheticEventFn: createSyntheticEvent.bind(null, document)
      });
    },
    registerWindowLoadedTrigger: function (trigger) {
      registry[WINDOW_LOADED].push({
        trigger: trigger,
        syntheticEventFn: createSyntheticEvent.bind(null, window)
      });
    }
  };
}

export default createPageLifecycleEvents;

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

'use strict';

// We need to be able to fire the rules in a specific order, no matter if the library is loaded
// sync or async. The rules are fired in the following order:
// Library loaded rules -> Page bottom rules -> Dom Ready rules -> Window load rules.

var window = require('@adobe/reactor-window');
var document = require('@adobe/reactor-document');

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

// Depending on the way the Launch library was loaded, none of the registered listeners that
// execute `processRegistry` may fire . We need to execute the `processRegistry` method at
// least once. If this timeout fires before any of the registered listeners, we auto-detect the
// current lifecycle event and fire all the registered triggers in order. We don't care if the
// `processRegistry` is called multiple times for the same lifecycle event. We fire the registered
// triggers for a lifecycle event only once. We used a `setTimeout` here to make sure all the rules
// using Library Loaded are registered and executed synchronously and before rules using any of the
// other lifecycle event types.
window.setTimeout(function () {
  var lifecycleEvent = detectLifecycleEvent();
  if (lifecycleEvent) {
    processRegistry(lifecycleEvent);
  }
}, 0);

module.exports = {
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

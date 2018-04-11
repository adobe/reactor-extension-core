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

describe('pageLifecycleEvents', function() {
  var triggerDOMContentLoaded;
  var triggerWindowLoad;
  var triggerSetTimeout;

  var mockWindow;
  var mockDocument;

  var triggers;
  var triggersResults;
  var delegate;

  var pageLifecycleEventsInjector = require('inject!../pageLifecycleEvents');

  var triggerTypesToRegisterMethods = {
    libraryLoaded: 'registerLibraryLoadedTrigger',
    pageBottom: 'registerPageBottomTrigger',
    domReady: 'registerDomReadyTrigger',
    windowLoaded: 'registerWindowLoadedTrigger'
  };

  var generateTriggers = function() {
    var triggers = {};
    Object.keys(triggerTypesToRegisterMethods).forEach(function(type) {
      triggers[type] = jasmine.createSpy(type).and.callFake(function() {
        triggersResults.push(type);
      });
    });

    return triggers;
  };

  var registerTriggers = function(delegate, triggers) {
    Object.keys(triggers).forEach(function(key) {
      delegate[triggerTypesToRegisterMethods[key]](triggers[key]);
    });
  };

  var checkTriggersFired = function(triggers, lifecycles) {
    Object.keys(triggers).forEach(function(key) {
      if (lifecycles.indexOf(key) !== -1) {
        expect(triggers[key]).toHaveBeenCalled();
      } else {
        expect(triggers[key]).not.toHaveBeenCalled();
      }
    });
  };

  beforeEach(function() {
    mockWindow = {
      navigator: { appVersion: 'something Chrome something' },
      addEventListener: function(type, callback) {
        if (type === 'load') {
          triggerWindowLoad = callback;
        }
      },
      setTimeout: function(callback) {
        triggerSetTimeout = callback;
      }
    };

    mockDocument = {
      readyState: 'loading',
      addEventListener: function(type, callback) {
        if (type === 'DOMContentLoaded') {
          triggerDOMContentLoaded = callback;
        }
      }
    };

    triggersResults = [];
    triggers = generateTriggers();

    delegate = pageLifecycleEventsInjector({
      '@adobe/reactor-window': mockWindow,
      '@adobe/reactor-document': mockDocument
    });

    registerTriggers(delegate, triggers);
  });

  afterAll(function() {
    resetTurbineVariable();
  });

  it('runs only library loaded triggers when library finishes loading', function() {
    checkTriggersFired(triggers, ['libraryLoaded']);
  });

  it('runs library loaded and page bottom triggers on page bottom', function() {
    mockWindow._satellite.pageBottom();
    checkTriggersFired(triggers, ['libraryLoaded', 'pageBottom']);
  });

  it('runs library loaded and page bottom and dom ready triggers on dom content loaded',
    function() {
      triggerDOMContentLoaded();
      checkTriggersFired(triggers, ['libraryLoaded', 'pageBottom', 'domReady']);
    });

  it('runs all triggers on window load', function() {
    triggerWindowLoad();

    checkTriggersFired(triggers, [
      'libraryLoaded',
      'pageBottom',
      'domReady',
      'windowLoaded'
    ]);
  });

  it('runs all triggers in order', function() {
    triggerWindowLoad();

    expect(triggersResults).toEqual([
      'libraryLoaded',
      'pageBottom',
      'domReady',
      'windowLoaded'
    ]);
  });

  it('runs all triggers only once', function() {
    mockWindow._satellite.pageBottom();
    triggerDOMContentLoaded();
    triggerWindowLoad();

    Object.keys(triggers).forEach(function(key) {
      expect(triggers[key].calls.count()).toBe(1);
    });
  });

  it('sends synthetic events to the dom ready triggers', function() {
    var fakeEvent = {};
    triggerDOMContentLoaded(fakeEvent);

    expect(triggers.domReady.calls.mostRecent().args[0]).toEqual({
      element: mockDocument,
      target: mockDocument,
      nativeEvent: fakeEvent
    });
  });

  it('sends synthetic events to the window loaded triggers', function() {
    var fakeEvent = {};
    triggerWindowLoad(fakeEvent);

    expect(triggers.windowLoaded.calls.mostRecent().args[0]).toEqual({
      element: mockWindow,
      target: mockWindow,
      nativeEvent: fakeEvent
    });
  });

  it('auto detects correctly library loaded lifecycle event', function() {
    triggerSetTimeout();
    checkTriggersFired(triggers, ['libraryLoaded']);
  });

  it('auto detects correctly dom ready lifecycle event', function() {
    mockDocument.readyState = 'interactive';
    var delegate = pageLifecycleEventsInjector({
      '@adobe/reactor-window': mockWindow,
      '@adobe/reactor-document': mockDocument
    });
    registerTriggers(delegate, triggers);

    triggerSetTimeout();
    checkTriggersFired(triggers, ['libraryLoaded', 'pageBottom', 'domReady']);
  });

  it('auto detects correctly window loaded lifecycle event', function() {
    mockDocument.readyState = 'complete';
    var delegate = pageLifecycleEventsInjector({
      '@adobe/reactor-window': mockWindow,
      '@adobe/reactor-document': mockDocument
    });
    registerTriggers(delegate, triggers);

    triggerSetTimeout();
    checkTriggersFired(triggers, [
      'libraryLoaded',
      'pageBottom',
      'domReady',
      'windowLoaded'
    ]);
  });

  it("doesn't run dom ready events in IE10 until window is loaded", function() {
    mockDocument.readyState = 'interactive';
    mockWindow.navigator.appVersion = 'MSIE 10';

    var delegate = pageLifecycleEventsInjector({
      '@adobe/reactor-window': mockWindow,
      '@adobe/reactor-document': mockDocument
    });
    registerTriggers(delegate, triggers);

    mockWindow._satellite.pageBottom();
    triggerSetTimeout();
    checkTriggersFired(triggers, ['libraryLoaded', 'pageBottom']);
  });
});

/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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

var entersViewportInjector = require('inject!../entersViewport');

var POLL_INTERVAL = 3000;
var DEBOUNCE_DELAY = 200;

/**
 * Provides a document object that provides native functionality but
 * allows for better mocking capability (e.g., able to set readyState)
 */
var getDocumentProxy = function() {
  return {
    get body() {
      return document.body;
    },
    get scrollTop() {
      return document.scrollTop;
    },
    get documentElement() {
      return document.documentElement;
    },
    get compatMode() {
      return document.compatMode;
    },
    querySelectorAll: function() {
      return document.querySelectorAll.apply(document, arguments);
    },
    addEventListener: function() {
      return window.addEventListener.apply(window, arguments);
    }
  };
};

/**
 * Provides a window object that provides native functionality but
 * allows for better mocking capability (e.g., able to set navigator.appVersion)
 */
var getWindowProxy = function() {
  return {
    get pageXOffset() {
      return window.pageXOffset;
    },
    get pageYOffset() {
      return window.pageYOffset;
    },
    get innerHeight() {
      return window.innerHeight;
    },
    addEventListener: function() {
      return window.addEventListener.apply(window, arguments);
    }
  };
};

describe('enters viewport event delegate', function() {
  var aElement;
  var bElement;

  var createElements = function() {
    aElement = document.createElement('div');
    aElement.id = 'a';
    aElement.innerHTML = 'a';
    aElement.customProp = 'foo';
    document.body.insertBefore(aElement, document.body.firstChild);

    bElement = document.createElement('div');
    bElement.id = 'b';
    bElement.innerHTML = 'b';
    bElement.customProp = 'foo';
    aElement.appendChild(bElement);
  };

  var removeElements = function() {
    if (aElement) {
      document.body.removeChild(aElement);
    }
    aElement = bElement = null;
  };

  var assertTriggerCall = function(options) {
    expect(options.call.args[0]).toEqual({
      element: options.element,
      target: options.target,
      delay: options.delay
    });
  };

  beforeAll(function() {
    jasmine.clock().install();
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  beforeEach(function() {
    createElements();
  });

  afterEach(function() {
    removeElements();
    window.scrollTo(0, 0);
  });

  describe('with document.readyState at complete', function() {
    var delegate;

    beforeAll(function() {
      var mockDocument = getDocumentProxy();
      mockDocument.readyState = 'complete';

      delegate = entersViewportInjector({
        '@adobe/reactor-document': mockDocument
      });
    });

    it('calls trigger with event and related element', function() {
      var aTrigger = jasmine.createSpy();

      delegate({
        elementSelector: '#a'
      }, aTrigger);

      jasmine.clock().tick(POLL_INTERVAL);

      assertTriggerCall({
        call: aTrigger.calls.mostRecent(),
        element: aElement,
        target: aElement
      });
    });

    it('triggers multiple rules targeting the same element with no delay', function() {
      var aTrigger = jasmine.createSpy();
      var a2Trigger = jasmine.createSpy();

      delegate({
        elementSelector: '#a'
      }, aTrigger);

      delegate({
        elementSelector: '#a'
      }, a2Trigger);

      jasmine.clock().tick(POLL_INTERVAL);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(1);
    });

    it('triggers multiple rules targeting the same element with same delay', function() {
      var aTrigger = jasmine.createSpy();
      var a2Trigger = jasmine.createSpy();

      delegate({
        elementSelector: '#a',
        delay: 100000
      }, aTrigger);

      delegate({
        elementSelector: '#a',
        delay: 100000
      }, a2Trigger);

      jasmine.clock().tick(POLL_INTERVAL);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(0);

      jasmine.clock().tick(100000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(1);
    });

    it('triggers multiple rules targeting the same element with different delays', function() {
      var aTrigger = jasmine.createSpy();
      var a2Trigger = jasmine.createSpy();

      delegate({
        elementSelector: '#a',
        delay: 100000
      }, aTrigger);

      delegate({
        elementSelector: '#a',
        delay: 200000
      }, a2Trigger);

      jasmine.clock().tick(POLL_INTERVAL);

      expect(aTrigger.calls.count()).toEqual(0);
      expect(a2Trigger.calls.count()).toEqual(0);

      jasmine.clock().tick(100000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(0);

      jasmine.clock().tick(100000);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(1);
    });

    it('triggers multiple rules targeting the same element with different selectors', function() {
      var aTrigger = jasmine.createSpy();
      var a2Trigger = jasmine.createSpy();

      delegate({
        elementSelector: '#a'
      }, aTrigger);

      delegate({
        elementSelector: 'div#a'
      }, a2Trigger);

      jasmine.clock().tick(POLL_INTERVAL);

      expect(aTrigger.calls.count()).toEqual(1);
      expect(a2Trigger.calls.count()).toEqual(1);
    });

    it('triggers rule when elementProperties match', function() {
      var bTrigger = jasmine.createSpy();

      delegate({
        elementSelector: '#b',
        elementProperties: [{
          name: 'innerHTML',
          value: 'b'
        }]
      }, bTrigger);

      jasmine.clock().tick(POLL_INTERVAL);

      expect(bTrigger.calls.count()).toEqual(1);
    });

    it('does not trigger rule when elementProperties do not match', function() {
      var bTrigger = jasmine.createSpy();

      delegate({
        elementSelector: '#b',
        elementProperties: [{
          name: 'innerHTML',
          value: 'no match'
        }]
      }, bTrigger);

      jasmine.clock().tick(POLL_INTERVAL);

      expect(bTrigger.calls.count()).toEqual(0);
    });

    it('triggers rule when targeting using elementProperties', function() {
      var bTrigger = jasmine.createSpy();

      delegate({
        elementSelector: 'div',
        elementProperties: [
          {
            name: 'id',
            value: 'b'
          }
        ]
      }, bTrigger);

      jasmine.clock().tick(POLL_INTERVAL);

      assertTriggerCall({
        call: bTrigger.calls.mostRecent(),
        element: bElement,
        target: bElement
      });
    });

    it('triggers rule for each matching element', function() {
      var trigger = jasmine.createSpy();

      delegate({
        elementSelector: 'div',
        elementProperties: [
          {
            name: 'customProp',
            value: 'foo'
          }
        ]
      }, trigger);

      jasmine.clock().tick(POLL_INTERVAL);

      assertTriggerCall({
        call: trigger.calls.first(),
        element: aElement,
        target: aElement
      });

      assertTriggerCall({
        call: trigger.calls.mostRecent(),
        element: bElement,
        target: bElement
      });

      var elementAddedLater = document.createElement('div');
      elementAddedLater.customProp = 'foo';
      document.body.appendChild(elementAddedLater);

      jasmine.clock().tick(POLL_INTERVAL);

      assertTriggerCall({
        call: trigger.calls.mostRecent(),
        element: elementAddedLater,
        target: elementAddedLater
      });
    });

    // The following tests have been commented out because they periodically fail when being run
    // inside SauceLabs and we haven't found a fix for it. If you're working on the enters viewport
    // code locally, it may be beneficial to uncomment the tests while you make changes.

    // iOS Safari doesn't allow iframes to have overflow (scrollbars) but instead pushes the
    // iframe's height to match the height of the content. Since by default Karma loads tests
    // into an iFrame, these scrolling tests fail. There is a setting to not use an iFrame, but
    // it's not awesome because you have to make sure every browser you're testing on is
    // not blocking pop-ups. That is, until this issue is resolved:
    // https://github.com/karma-runner/karma/issues/849
    // Until then, we're skipping these tests on iOS.

    // var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    // if (!isIOS) {
    //   describe('with scrolling', function() {
    //     it('triggers rule with no delay', function() {
    //       aElement.style.position = 'absolute';
    //       aElement.style.top = '3000px';
    //
    //       var aTrigger = jasmine.createSpy();
    //
    //       delegate({
    //         elementSelector: '#a'
    //       }, aTrigger);
    //
    //
    //       Simulate.event(window, 'scroll');
    //       jasmine.clock().tick(DEBOUNCE_DELAY); // Skip past debounce.
    //
    //       // The rule shouldn't be triggered because the element isn't in view.
    //       expect(aTrigger.calls.count()).toEqual(0);
    //
    //       window.scrollTo(0, 3000);
    //       Simulate.event(window, 'scroll');
    //       jasmine.clock().tick(DEBOUNCE_DELAY); // Skip past debounce.
    //
    //       expect(aTrigger.calls.count()).toEqual(1);
    //     });
    //
    //     it('triggers rules with various delays targeting elements at ' +
    //       'various positions', function() {
    //       aElement.style.position = 'absolute';
    //       aElement.style.top = '10000px';
    //
    //       bElement.style.position = 'absolute';
    //       bElement.style.top = '10000px';
    //
    //       var aTrigger = jasmine.createSpy();
    //       var bTrigger = jasmine.createSpy();
    //       var b2Trigger = jasmine.createSpy();
    //
    //       delegate({
    //         elementSelector: '#a'
    //       }, aTrigger);
    //
    //       delegate({
    //         elementSelector: '#b',
    //         delay: 50000
    //       }, bTrigger);
    //
    //       delegate({
    //         elementSelector: '#b',
    //         delay: 200000
    //       }, b2Trigger);
    //
    //       jasmine.clock().tick(POLL_INTERVAL);
    //
    //       expect(aTrigger.calls.count()).toEqual(0);
    //       expect(bTrigger.calls.count()).toEqual(0);
    //       expect(b2Trigger.calls.count()).toEqual(0);
    //
    //       window.scrollTo(0, 10000);
    //       jasmine.clock().tick(POLL_INTERVAL);
    //
    //       expect(aTrigger.calls.count()).toEqual(1);
    //       expect(bTrigger.calls.count()).toEqual(0);
    //       expect(b2Trigger.calls.count()).toEqual(0);
    //
    //       window.scrollTo(0, 0);
    //       jasmine.clock().tick(POLL_INTERVAL);
    //
    //       window.scrollTo(0, 10000);
    //       jasmine.clock().tick(POLL_INTERVAL);
    //
    //       // The first trigger should only be called the first time the element comes into view.
    //       expect(aTrigger.calls.count()).toEqual(1);
    //       expect(bTrigger.calls.count()).toEqual(0);
    //       expect(b2Trigger.calls.count()).toEqual(0);
    //
    //       window.scrollTo(0, 20000);
    //       jasmine.clock().tick(POLL_INTERVAL);
    //
    //       expect(aTrigger.calls.count()).toEqual(1);
    //       expect(bTrigger.calls.count()).toEqual(0);
    //       expect(b2Trigger.calls.count()).toEqual(0);
    //
    //       window.scrollTo(0, 0);
    //       jasmine.clock().tick(POLL_INTERVAL);
    //
    //       // Give enough time for the configured delay time to pass. The b element rules
    //       // shouldn't be triggered because the b element is no longer in view.
    //       jasmine.clock().tick(100000);
    //
    //       expect(aTrigger.calls.count()).toEqual(1);
    //       expect(bTrigger.calls.count()).toEqual(0);
    //       expect(b2Trigger.calls.count()).toEqual(0);
    //
    //       window.scrollTo(0, 20000);
    //       jasmine.clock().tick(POLL_INTERVAL);
    //
    //       // Give enough time for the configured delay time to
    //       // pass. The second trigger should be called.
    //       jasmine.clock().tick(50000);
    //       expect(aTrigger.calls.count()).toEqual(1);
    //       expect(bTrigger.calls.count()).toEqual(1);
    //       expect(b2Trigger.calls.count()).toEqual(0);
    //
    //       // A different rule watching for the same element but an even longer delay time? Oh my!
    //       jasmine.clock().tick(200000);
    //       expect(aTrigger.calls.count()).toEqual(1);
    //       expect(bTrigger.calls.count()).toEqual(1);
    //       expect(b2Trigger.calls.count()).toEqual(1);
    //     });
    //   });
    // }
  });

  describe('with document.readyState at loading', function() {
    var mockDocument;
    var mockWindow;

    beforeEach(function() {
      mockDocument = getDocumentProxy();
      mockDocument.readyState = 'loading';
      spyOn(mockDocument, 'addEventListener');

      mockWindow = getWindowProxy();
      spyOn(mockWindow, 'addEventListener');
    });

    describe('with IE 10 browser', function() {
      it('waits until window load has fired before checking elements', function() {
        mockWindow.navigator = {
          appVersion: 'MSIE 10'
        };

        var delegate = entersViewportInjector({
          '@adobe/reactor-document': mockDocument,
          '@adobe/reactor-window': mockWindow
        });

        var aTrigger = jasmine.createSpy();

        delegate({
          elementSelector: '#a'
        }, aTrigger);

        jasmine.clock().tick(DEBOUNCE_DELAY);

        expect(aTrigger).not.toHaveBeenCalled();
        expect(mockWindow.addEventListener).toHaveBeenCalledWith(
          'load',
          jasmine.any(Function)
        );

        var windowLoadCallback = mockWindow.addEventListener.calls.first().args[1];
        windowLoadCallback();

        jasmine.clock().tick(DEBOUNCE_DELAY); // Skip past debounce.

        assertTriggerCall({
          call: aTrigger.calls.mostRecent(),
          element: aElement,
          target: aElement
        });
      });
    });

    describe('with browser that is not IE 10', function() {
      it('waits until DOMContentLoaded has fired before checking elements', function() {
        mockWindow.navigator = {
          appVersion: 'something Chrome something'
        };

        var delegate = entersViewportInjector({
          '@adobe/reactor-document': mockDocument,
          '@adobe/reactor-window': mockWindow
        });

        var aTrigger = jasmine.createSpy();

        delegate({
          elementSelector: '#a'
        }, aTrigger);

        jasmine.clock().tick(DEBOUNCE_DELAY);

        expect(aTrigger).not.toHaveBeenCalled();
        expect(mockDocument.addEventListener).toHaveBeenCalledWith(
          'DOMContentLoaded',
          jasmine.any(Function)
        );

        var domContentLoadedCallback = mockDocument.addEventListener.calls.first().args[1];
        domContentLoadedCallback();

        jasmine.clock().tick(DEBOUNCE_DELAY); // Skip past debounce.

        assertTriggerCall({
          call: aTrigger.calls.mostRecent(),
          element: aElement,
          target: aElement
        });
      });
    });
  });
});

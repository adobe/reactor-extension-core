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

'use strict';
var entersViewportInjector = require('inject-loader!../entersViewport');

/**
 * Provides a document object that provides native functionality but
 * allows for better mocking capability (e.g., able to set readyState)
 */
var getDocumentProxy = function () {
  return {
    get body() {
      return document.body;
    },
    get documentElement() {
      return document.documentElement;
    },
    querySelectorAll: function () {
      return document.querySelectorAll.apply(document, arguments);
    },
    addEventListener: function () {
      return window.addEventListener.apply(window, arguments);
    }
  };
};

/**
 * Provides a window object that provides native functionality but
 * allows for better mocking capability (e.g., able to set navigator.appVersion)
 */
var getWindowProxy = function () {
  return {
    addEventListener: function () {
      return window.addEventListener.apply(window, arguments);
    },
    setInterval: function () {
      return window.setInterval.apply(window, arguments);
    }
  };
};

describe('enters viewport event delegate', function () {
  var aElement;
  var aElementId;
  var bElement;
  var bElementId;
  var customPropValue;

  var createElements = function () {
    var timeMillis = Date.now();
    customPropValue = 'foo-' + timeMillis;
    aElement = document.createElement('div');
    aElement.id = 'a-' + timeMillis;
    aElementId = '#a-' + timeMillis;
    aElement.innerHTML = 'a';
    aElement.customProp = customPropValue;
    document.body.appendChild(aElement);

    bElement = document.createElement('div');
    bElement.id = 'b-' + timeMillis;
    bElementId = '#b-' + timeMillis;
    bElement.innerHTML = 'b';
    bElement.customProp = customPropValue;
    aElement.appendChild(bElement);
  };

  var removeElements = function () {
    if (aElement) {
      document.body.removeChild(aElement);
    }

    aElement = bElement = null;
  };

  var assertTriggerCall = function (options) {
    expect(options.element).not.toBeFalsy();
    expect(options.target).not.toBeFalsy();
    expect(options.callData).toEqual({
      element: options.element,
      target: options.target,
      delay: options.delay
    });
  };

  beforeEach(function () {
    createElements();
    window.scrollTo(0, 0);
  });

  afterEach(function () {
    removeElements();
  });

  describe('with document.readyState at complete', function () {
    var delegate;

    beforeAll(function () {
      var mockDocument = getDocumentProxy();
      mockDocument.readyState = 'complete';

      delegate = entersViewportInjector({
        '@adobe/reactor-document': mockDocument
      });
    });

    it('calls trigger with event and related element', function (done) {
      // when the trigger function is called, assert the result it was called with
      var triggerA = {
        triggerFn: null
      };

      triggerA.triggerFn = function (callData) {
        assertTriggerCall({
          callData: callData,
          element: aElement,
          target: aElement
        });
        done();
      };

      delegate(
        {
          elementSelector: aElementId
        },
        triggerA.triggerFn
      );
    });

    it('triggers multiple rules targeting the same element with no delay', function (done) {
      var triggerA = {
        triggerFn: null,
        count: 0
      };
      var triggerA2 = {
        triggerFn: null,
        count: 0
      };

      var initialTime;

      // wait for both trigger functions to have been called
      Promise.all([
        new Promise(function (resolve) {
          triggerA.triggerFn = function () {
            triggerA.count += 1;
            resolve();
          };
        }),
        new Promise(function (resolve) {
          triggerA2.triggerFn = function () {
            triggerA2.count += 1;
            resolve();
          };
        })
      ]).then(function () {
        var elapsedTime = Date.now() - initialTime;
        expect(triggerA.count).toBe(1);
        expect(triggerA2.count).toBe(1);
        expect(elapsedTime).toBeLessThan(1000);
        done();
      });

      initialTime = Date.now();
      delegate(
        {
          elementSelector: aElementId
        },
        triggerA.triggerFn
      );

      delegate(
        {
          elementSelector: aElementId
        },
        triggerA2.triggerFn
      );
    });

    it('handles settings.delay as a string', function (done) {
      var triggerA = {
        triggerFn: null
      };

      triggerA.triggerFn = function (callData) {
        assertTriggerCall({
          callData: callData,
          element: aElement,
          target: aElement,
          delay: 100
        });
        done();
      };

      delegate(
        {
          // elementSelector: 'div[id="' + aElementId + '"]',
          elementSelector: aElementId,
          elementProperties: [
            {
              name: 'customProp',
              value: customPropValue
            }
          ],
          delay: '100'
        },
        triggerA.triggerFn
      );
    });

    it('triggers multiple rules targeting the same element with same delay', function (done) {
      var triggerA = {
        triggerFn: null,
        count: 0
      };
      var triggerA2 = {
        triggerFn: null,
        count: 0
      };
      var initialTime;
      var triggerDelay = 1000;

      // wait for both trigger functions to have been called
      Promise.all([
        new Promise(function (resolve) {
          // aTrigger = jasmine.createSpy().and.callFake(resolve);
          triggerA.triggerFn = function () {
            triggerA.count += 1;
            resolve();
          };
        }),
        new Promise(function (resolve) {
          // a2Trigger = jasmine.createSpy().and.callFake(resolve);
          triggerA2.triggerFn = function () {
            triggerA2.count += 1;
            resolve();
          };
        })
      ]).then(function () {
        var elapsedTime = Date.now() - initialTime;
        expect(triggerA.count).toBe(1);
        expect(triggerA2.count).toBe(1);
        expect(elapsedTime).toBeGreaterThanOrEqual(triggerDelay);
        expect(elapsedTime).toBeLessThan(triggerDelay + 1000);
        done();
      });

      initialTime = Date.now();
      delegate(
        {
          elementSelector: aElementId,
          delay: 1000
        },
        triggerA.triggerFn
      );

      delegate(
        {
          elementSelector: aElementId,
          delay: 1000
        },
        triggerA2.triggerFn
      );
    });

    it(
      'triggers multiple rules targeting the same element with different ' +
        ' delays',
      function (done) {
        var triggerA = {
          triggerFn: null,
          count: 0
        };
        var triggerA2 = {
          triggerFn: null,
          count: 0
        };
        var initialTime;
        var aTriggerDelay = 100;
        var a2TriggerDelay = 500;

        // wait for both trigger functions to have been called
        Promise.all([
          new Promise(function (resolve) {
            triggerA.triggerFn = function () {
              var now = Date.now();
              triggerA.count += 1;
              expect(now).toBeGreaterThanOrEqual(initialTime + aTriggerDelay);
              expect(now).toBeLessThanOrEqual(initialTime + a2TriggerDelay);
              resolve();
            };
          }),
          new Promise(function (resolve) {
            triggerA2.triggerFn = function () {
              var now = Date.now();
              triggerA2.count += 1;
              expect(now).toBeGreaterThanOrEqual(initialTime + aTriggerDelay);
              expect(now).toBeGreaterThanOrEqual(initialTime + a2TriggerDelay);
              resolve();
            };
          })
        ]).then(function () {
          expect(triggerA.count).toBe(1);
          expect(triggerA2.count).toBe(1);
          done();
        });

        initialTime = Date.now();

        delegate(
          {
            elementSelector: aElementId,
            delay: aTriggerDelay
          },
          triggerA.triggerFn
        );

        delegate(
          {
            elementSelector: aElementId,
            delay: a2TriggerDelay
          },
          triggerA2.triggerFn
        );
      }
    );

    it(
      'triggers multiple rules targeting the same element with different ' +
        'selectors',
      function (done) {
        var triggerA = {
          triggerFn: null,
          count: 0
        };
        var triggerA2 = {
          triggerFn: null,
          count: 0
        };

        // wait for both trigger functions to have been called
        Promise.all([
          new Promise(function (resolve) {
            triggerA.triggerFn = function () {
              triggerA.count += 1;
              resolve();
            };
          }),
          new Promise(function (resolve) {
            triggerA2.triggerFn = function () {
              triggerA2.count += 1;
              resolve();
            };
          })
        ]).then(function () {
          expect(triggerA.count).toBe(1);
          expect(triggerA2.count).toBe(1);
          done();
        });

        delegate(
          {
            elementSelector: aElementId
          },
          triggerA.triggerFn
        );

        delegate(
          {
            elementSelector: 'div' + aElementId
          },
          triggerA2.triggerFn
        );
      }
    );

    it('triggers rule when elementProperties match', function (done) {
      var triggerB = {
        triggerFn: null,
        count: 0
      };
      triggerB.triggerFn = function (callData) {
        assertTriggerCall({
          callData: callData,
          element: bElement,
          target: bElement
        });
        done();
      };

      delegate(
        {
          elementSelector: bElementId,
          elementProperties: [
            {
              name: 'innerHTML',
              value: 'b'
            }
          ]
        },
        triggerB.triggerFn
      );
    });

    it('does not trigger rule when elementProperties do not match', function (done) {
      var triggerB = {
        triggerFn: null,
        count: 0
      };

      Promise.race([
        new Promise(function (resolve) {
          triggerB.triggerFn = function () {
            triggerB.count += 1;
            resolve();
          };
        }),
        new Promise(function (resolve) {
          setTimeout(resolve, 500);
        })
      ]).then(function () {
        expect(triggerB.count).toBe(0);
        done();
      });

      delegate(
        {
          elementSelector: bElementId,
          elementProperties: [
            {
              name: 'innerHTML',
              value: 'no match'
            }
          ]
        },
        triggerB.triggerFn
      );
    });

    it('triggers rule when targeting using elementProperties', function (done) {
      var triggerB = {
        triggerFn: null
      };

      triggerB.triggerFn = function (callData) {
        assertTriggerCall({
          callData: callData,
          element: bElement,
          target: bElement
        });
        done();
      };

      delegate(
        {
          elementSelector: 'div',
          elementProperties: [
            {
              name: 'id',
              value: bElementId.slice(1) // remove the leading # character
            }
          ]
        },
        triggerB.triggerFn
      );
    });

    it('triggers rule for each matching element', function (done) {
      var trigger = {
        triggerFn: null,
        fnCalls: []
      };
      trigger.triggerFn = function (callData) {
        trigger.fnCalls.push(callData);
      };
      var elementAddedLater;

      Promise.resolve()
        .then(function () {
          return new Promise(function (resolve) {
            var intervalId = window.setInterval(function () {
              if (trigger.fnCalls.length === 2) {
                window.clearInterval(intervalId);
                resolve();
              }
            }, 50);
          });
        })
        .then(function () {
          trigger.fnCalls = trigger.fnCalls.sort(function (el1, el2) {
            return el1.id - el2.id;
          });
          assertTriggerCall({
            callData: trigger.fnCalls[0],
            element: aElement,
            target: aElement
          });
          assertTriggerCall({
            callData: trigger.fnCalls[1],
            element: bElement,
            target: bElement
          });
          trigger.fnCalls = [];
        })
        .then(function () {
          elementAddedLater = document.createElement('div');
          elementAddedLater.id = 'c-element';
          elementAddedLater.innerHTML = 'c';
          elementAddedLater.customProp = customPropValue;
          document.body.appendChild(elementAddedLater);

          return new Promise(function (resolve) {
            var intervalId = window.setInterval(function () {
              if (trigger.fnCalls.length === 1) {
                window.clearInterval(intervalId);
                assertTriggerCall({
                  callData: trigger.fnCalls[0],
                  element: elementAddedLater,
                  target: elementAddedLater
                });
                resolve();
              }
            }, 50);
          });
        })
        .then(function () {
          document.body.removeChild(elementAddedLater);
          done();
        });

      delegate(
        {
          elementSelector: 'div',
          elementProperties: [
            {
              name: 'customProp',
              value: customPropValue
            }
          ]
        },
        trigger.triggerFn
      );
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
    //       var a2Trigger = jasmine.createSpy();
    //       var bTrigger = jasmine.createSpy();
    //       var b2Trigger = jasmine.createSpy();
    //
    //       delegate({
    //         elementSelector: '#a'
    //       }, aTrigger);
    //
    //       delegate({
    //         elementSelector: '#a',
    //         frequency: 'everyTime'
    //       }, a2Trigger);
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
    //       expect(a2Trigger.calls.count()).toEqual(0);
    //       expect(bTrigger.calls.count()).toEqual(0);
    //       expect(b2Trigger.calls.count()).toEqual(0);
    //
    //       window.scrollTo(0, 10000);
    //       jasmine.clock().tick(POLL_INTERVAL);
    //
    //       expect(aTrigger.calls.count()).toEqual(1);
    //       expect(a2Trigger.calls.count()).toEqual(1);
    //       expect(bTrigger.calls.count()).toEqual(0);
    //       expect(b2Trigger.calls.count()).toEqual(0);
    //
    //       window.scrollTo(0, 0);
    //       jasmine.clock().tick(POLL_INTERVAL);
    //
    //       window.scrollTo(0, 10000);
    //       // Enough time for the poll interval to elapse many times. The point here is to test:
    //       // 1. aTrigger should not be called again because the event is configured to only
    //       // fire the first time the element enters the viewport.
    //       // 2. a2Trigger should be called again because the event is configured to fire
    //       // the rule each time it enters the viewport.
    //       // 3. a2Trigger should not be repeatedly called on every poll cycle if the element
    //       // has remained inside the viewport throughout that duration.
    //       jasmine.clock().tick(POLL_INTERVAL * 10);
    //
    //       expect(aTrigger.calls.count()).toEqual(1);
    //       expect(a2Trigger.calls.count()).toEqual(2);
    //       expect(bTrigger.calls.count()).toEqual(0);
    //       expect(b2Trigger.calls.count()).toEqual(0);
    //
    //       window.scrollTo(0, 20000);
    //       jasmine.clock().tick(POLL_INTERVAL);
    //
    //       expect(aTrigger.calls.count()).toEqual(1);
    //       expect(a2Trigger.calls.count()).toEqual(2);
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
    //       expect(a2Trigger.calls.count()).toEqual(2);
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
    //       expect(a2Trigger.calls.count()).toEqual(2);
    //       expect(bTrigger.calls.count()).toEqual(1);
    //       expect(b2Trigger.calls.count()).toEqual(0);
    //
    //       // A different rule watching for the same element but an even longer delay time? Oh my!
    //       jasmine.clock().tick(200000);
    //       expect(aTrigger.calls.count()).toEqual(1);
    //       expect(a2Trigger.calls.count()).toEqual(2);
    //       expect(bTrigger.calls.count()).toEqual(1);
    //       expect(b2Trigger.calls.count()).toEqual(1);
    //     });
    //   });
    // }
  });

  describe('with document.readyState at loading', function () {
    var mockDocument;
    var mockWindow;

    beforeEach(function () {
      mockDocument = getDocumentProxy();
      mockDocument.readyState = 'loading';
      spyOn(mockDocument, 'addEventListener');

      mockWindow = getWindowProxy();
      spyOn(mockWindow, 'addEventListener');
    });

    describe('with browser that is not IE 10', function () {
      it('waits until DOMContentLoaded has fired before checking elements', function (done) {
        expect(document.querySelectorAll(aElementId).length).toBe(1);
        mockWindow.navigator = {
          appVersion: 'something Chrome something'
        };

        var delegate = entersViewportInjector({
          '@adobe/reactor-document': mockDocument,
          '@adobe/reactor-window': mockWindow
        });

        var aTrigger = jasmine.createSpy();

        delegate(
          {
            elementSelector: aElementId
          },
          aTrigger
        );

        new Promise(function (resolve) {
          window.setTimeout(resolve, 1000);
        })
          .then(function () {
            expect(aTrigger).not.toHaveBeenCalled();
            expect(mockDocument.addEventListener).toHaveBeenCalledWith(
              'DOMContentLoaded',
              jasmine.any(Function)
            );

            var domContentLoadedCallback =
              mockDocument.addEventListener.calls.first().args[1];
            domContentLoadedCallback();

            return new Promise(function (resolve) {
              var intervalId = window.setInterval(function () {
                if (aTrigger.calls.mostRecent()) {
                  window.clearInterval(intervalId);
                  resolve(aTrigger.calls.mostRecent().args[0]);
                }
              }, 50);
            });
          })
          .then(function (callData) {
            assertTriggerCall({
              callData: callData,
              element: aElement,
              target: aElement
            });
            done();
          });
      });
    });
  });
});

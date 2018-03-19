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

describe('dom ready event delegate', function() {
  var domReadyInjector = require('inject!../domReady');
  var mockDocument;
  var mockWindow;
  var delegate;

  var triggerDOMContentLoaded;

  beforeEach(function() {
    mockWindow = {
      navigator: {
        appVersion: 'something Chrome something'
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
  });

  it('triggers rule when the dom ready event occurs', function() {
    delegate = domReadyInjector({
      '@adobe/reactor-window': mockWindow,
      '@adobe/reactor-document': mockDocument
    });

    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    triggerDOMContentLoaded({
      type: 'DOMContentLoaded'
    });

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    var syntheticEvent = call.args[0];
    expect(syntheticEvent.element).toBe(mockDocument);
    expect(syntheticEvent.target).toBe(mockDocument);
    expect(syntheticEvent.nativeEvent.type).toBe('DOMContentLoaded');
  });

  it('triggers rule when the dom ready event has already occurred', function() {
    mockDocument.readyState = 'interactive';

    delegate = domReadyInjector({
      '@adobe/reactor-window': mockWindow,
      '@adobe/reactor-document': mockDocument
    });

    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    var syntheticEvent = call.args[0];
    expect(syntheticEvent.element).toBe(mockDocument);
    expect(syntheticEvent.target).toBe(mockDocument);
    expect(syntheticEvent.nativeEvent).toBeUndefined();
  });

  describe('when browser is IE 10 and readyState is interactive', function() {
    var triggerLoaded;

    beforeEach(function() {
      mockWindow = {
        navigator: {
          appVersion: 'something MSIE 10 something'
        },
        addEventListener: function(type, callback) {
          if (type === 'load') {
            triggerLoaded = callback;
          }
        }
      };
      mockDocument = {
        readyState: 'interactive'
      };
    });

    it('triggers rule when the window load event occurs', function() {
      delegate = domReadyInjector({
        '@adobe/reactor-window': mockWindow,
        '@adobe/reactor-document': mockDocument
      });

      var trigger = jasmine.createSpy();

      delegate({}, trigger);

      expect(trigger.calls.count()).toBe(0);

      triggerLoaded({
        type: 'load'
      });

      expect(trigger.calls.count()).toBe(1);
      var call = trigger.calls.mostRecent();
      var syntheticEvent = call.args[0];
      expect(syntheticEvent.element).toBe(mockDocument);
      expect(syntheticEvent.target).toBe(mockDocument);
      expect(syntheticEvent.nativeEvent.type).toBe('load');
    });
  });

});

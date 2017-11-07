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

describe('onload event type', function() {
  var onLoadInjector = require('inject!../onLoad');
  var triggerLoad;
  var mockWindow;
  var mockDocument;

  beforeEach(function() {
    mockWindow = {
      addEventListener: function(type, callback) {
        if (type === 'load') {
          triggerLoad = callback;
        }
      }
    };
    mockDocument = {
      readyState: 'loading'
    };
  });

  it('triggers rule when the load event occurs', function() {
    var delegate = onLoadInjector({
      '@adobe/reactor-window': mockWindow,
      '@adobe/reactor-document': mockDocument
    });

    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    triggerLoad({
      type: 'load'
    });

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    var syntheticEvent = call.args[0];
    expect(syntheticEvent.element).toBe(mockWindow);
    expect(syntheticEvent.target).toBe(mockWindow);
    expect(syntheticEvent.nativeEvent.type).toBe('load');
  });

  it('triggers rule when the load event has already occurred', function() {
    mockDocument.readyState = 'complete';

    var delegate = onLoadInjector({
      '@adobe/reactor-window': mockWindow,
      '@adobe/reactor-document': mockDocument
    });

    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    var syntheticEvent = call.args[0];
    expect(syntheticEvent.element).toBe(mockWindow);
    expect(syntheticEvent.target).toBe(mockWindow);
    expect(syntheticEvent.nativeEvent).toBeUndefined();
  });
});

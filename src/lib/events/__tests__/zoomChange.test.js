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

var assertTriggerCall = function(options) {
  expect(options.call.args[0]).toEqual({
    method: options.method,
    zoom: options.zoom
  });
};

describe('zoom change event delegate', function() {
  var delegate;
  var mockWindow = {
    ongestureend: null,
    ontouchend: null
  };

  beforeAll(function() {
    jasmine.clock().install();
    jasmine.clock().mockDate();

    var delegateInjector = require('inject-loader!../zoomChange');
    delegate = delegateInjector({
      '@adobe/reactor-window': mockWindow,
    });
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  it('triggers rule when zoom changes', function() {
    var trigger = jasmine.createSpy();

    mockWindow.innerWidth = document.documentElement.clientWidth;

    delegate({}, trigger);

    Simulate.event(document, 'gestureend');

    mockWindow.innerWidth = document.documentElement.clientWidth / 1.5;

    expect(trigger.calls.count()).toEqual(0);

    jasmine.clock().tick(1049);

    expect(trigger.calls.count()).toEqual(0);

    jasmine.clock().tick(1);

    expect(trigger.calls.count()).toEqual(1);
    assertTriggerCall({
      call: trigger.calls.mostRecent(),
      method: 'pinch',
      zoom: '1.50'
    });

    Simulate.event(document, 'touchend');
    mockWindow.innerWidth = document.documentElement.clientWidth / 2;

    jasmine.clock().tick(1249);

    expect(trigger.calls.count()).toEqual(1);

    jasmine.clock().tick(1);

    expect(trigger.calls.count()).toEqual(2);
    assertTriggerCall({
      call: trigger.calls.mostRecent(),
      method: 'double tap',
      zoom: '2.00'
    });
  });
});

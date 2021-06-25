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

var directCallActionDelegateInjector = require('inject-loader!../directCall');

describe('direct call action delegate', function () {
  var mockWindow = {};
  var delegate;

  beforeEach(function () {
    mockWindow._satellite = jasmine.createSpyObj('_satellite', ['track']);

    delegate = directCallActionDelegateInjector({
      '@adobe/reactor-window': mockWindow
    });
  });

  it('triggers the specified direct-call Event Type without a detail', function () {
    var settings = {
      identifier: 'foo'
    };

    // run the Action
    delegate(settings);

    // check that the Action has called _satellite.track() properly
    expect(mockWindow._satellite.track).toHaveBeenCalledWith('foo');
  });

  it('triggers the specified direct-call Event Type with a user-defined detail', function () {
    var detailObject = {
      bar: 'baz'
    };

    var settings = {
      identifier: 'foo',
      detail: function () {
        return detailObject;
      }
    };

    var event = {
      element: {},
      target: {}
    };

    spyOn(settings, 'detail').and.callThrough();
    delegate(settings, event);

    // check that the Action has called _satellite.track() properly
    expect(mockWindow._satellite.track).toHaveBeenCalledWith(
      'foo',
      detailObject
    );

    // check that _satellite.track() has received the detail object properly
    expect(settings.detail.calls.first()).toEqual({
      object: event.element,
      invocationOrder: jasmine.any(Number),
      args: [event, event.target],
      returnValue: detailObject
    });
  });
});

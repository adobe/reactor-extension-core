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

describe('direct call action delegate', function() {
  it('triggers the specified direct-call Event Type', function() {
    var mockWindow = {};
    mockWindow._satellite = jasmine.createSpyObj("_satellite", ["track"]);

    var delegate = directCallActionDelegateInjector({
      '@adobe/reactor-window': mockWindow
    });

    var settings = {
      identifier: 'foo'
    };

    var event = {
      prop: 'x'
    };

    // run the Action
    delegate(settings, event);

    // check that the Action has called _satellite.track() properly
    expect(mockWindow._satellite.track).toHaveBeenCalledWith('foo', { prop: 'x' });
  });

});

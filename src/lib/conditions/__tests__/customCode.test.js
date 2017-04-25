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

var conditionDelegate = require('../customCode');

describe('custom code condition delegate', function() {
  it('should run a user-defined function', function() {
    var settings = {
      source: function() {
        return true;
      }
    };

    var event = {
      currentTarget: {},
      target: {}
    };

    var relatedElement = {};

    spyOn(settings, 'source').and.callThrough();
    conditionDelegate(settings, relatedElement, event);

    expect(settings.source.calls.first()).toEqual({
      object: relatedElement,
      invocationOrder: jasmine.any(Number),
      args: [event, event.target],
      returnValue: true
    });
  });
});

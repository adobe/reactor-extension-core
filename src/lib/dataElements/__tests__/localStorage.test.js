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

describe('local storage data element delegate', function () {
  it('returns the value of a local storage item', function () {
    var mockWindow = {
      localStorage: {
        getItem: jasmine.createSpy().and.returnValue('bar')
      }
    };

    var dataElementDelegate = require('inject-loader!../localStorage')({
      '@adobe/reactor-window': mockWindow
    });

    var settings = {
      name: 'foo'
    };

    expect(dataElementDelegate(settings)).toBe('bar');
    expect(mockWindow.localStorage.getItem).toHaveBeenCalledWith('foo');
  });

  it('returns null if local storage item is not set', function () {
    var mockWindow = {
      localStorage: {
        getItem: jasmine.createSpy().and.returnValue(null)
      }
    };

    var dataElementDelegate = require('inject-loader!../localStorage')({
      '@adobe/reactor-window': mockWindow
    });

    var settings = {
      name: 'foo'
    };

    expect(dataElementDelegate(settings)).toBe(null);
    expect(mockWindow.localStorage.getItem).toHaveBeenCalledWith('foo');
  });

  it(
    'returns null if error is thrown (like when local storage is disabled ' +
      'in safari)',
    function () {
      var dataElementDelegate = require('inject-loader!../localStorage')({
        '@adobe/reactor-window': {}
      });

      var settings = {
        name: 'foo'
      };

      expect(dataElementDelegate(settings)).toBe(null);
    }
  );
});

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

var sequentiallyLoadCodePromiseInjector = require('inject!../loadCodeSequentially');
var Promise = require('@adobe/reactor-promise');

var sequentiallyLoadCodePromise = sequentiallyLoadCodePromiseInjector({
  './getSourceByUrl': function(sourceUrl) {
    if (sourceUrl === 'url1') {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve('url1 source code');
        }, 0);
      });
    } else {
      return Promise.resolve('url2 source code');
    }
  }
});

describe('load code sequentially', function() {
  it('does the correct loaded order', function(done) {
    var loadedCode = [];

    var action1 = sequentiallyLoadCodePromise('url1').then(function(code) {
      loadedCode.push(code);
    });

    var action2 = sequentiallyLoadCodePromise('url2').then(function(code) {
      loadedCode.push(code);
    });

    Promise.all([
      action2, action1
    ]).then(function() {
      expect(loadedCode).toEqual(['url1 source code', 'url2 source code']);
      done();
    });
  });
});

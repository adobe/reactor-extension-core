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

var getSourceUrlCodeInjector = require('inject-loader!../getSourceByUrl');
var Promise = require('@adobe/reactor-promise');

describe('get source by url', function () {
  var loadScriptSpy;
  var getSourceUrlCode;

  beforeEach(function () {
    loadScriptSpy = jasmine
      .createSpy('load-script')
      .and.callFake(function (url) {
        _satellite.__registerScript(url, 'script code');
        return Promise.resolve();
      });

    getSourceUrlCode = getSourceUrlCodeInjector({
      '@adobe/reactor-load-script': loadScriptSpy
    });
  });

  beforeEach(function () {
    loadScriptSpy.calls.reset();
  });

  it('loads the script containing the script only once', function () {
    getSourceUrlCode('url1');
    getSourceUrlCode('url1');

    expect(loadScriptSpy).toHaveBeenCalledTimes(1);
  });

  it('returns a promise that once fulfilled returns the code', function (done) {
    getSourceUrlCode('url1').then(function (code) {
      expect(code).toBe('script code');
      done();
    });
  });

  it('returns undefined when the script cannot be loaded', function (done) {
    var loadScriptSpy = jasmine
      .createSpy('load-script')
      .and.callFake(function (url) {
        _satellite.__registerScript(url, 'script code');
        return Promise.reject();
      });

    var getSourceUrlCode = getSourceUrlCodeInjector({
      '@adobe/reactor-load-script': loadScriptSpy
    });

    getSourceUrlCode('url1').then(function (code) {
      expect(code).toBeUndefined();
      done();
    });
  });
});

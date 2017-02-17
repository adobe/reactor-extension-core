/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

var getSourceUrlCodeInjector = require('inject!../getSourceByUrl');
var Promise = require('@adobe/reactor-turbine/lib/require')('@turbine/promise');

describe('get source by url', function() {
  var loadScriptSpy;
  var getSourceUrlCode;

  beforeAll(function() {
    loadScriptSpy = jasmine.createSpy('load-script').and.callFake(function(url) {
      _satellite.__registerScript(url, 'script code');
      return Promise.resolve();
    });

    getSourceUrlCode = getSourceUrlCodeInjector({
      '@turbine/load-script': loadScriptSpy
    });
  });

  beforeEach(function() {
    loadScriptSpy.calls.reset();
  });

  it('loads the script containing the script only once', function() {
    getSourceUrlCode('url1');
    getSourceUrlCode('url1');

    expect(loadScriptSpy).toHaveBeenCalledTimes(1);
  });

  it('returns a promise that once fulfilled returns the code', function(done) {
    getSourceUrlCode('url1').then(function(code) {
      expect(code).toBe('script code');
      done();
    });
  });

  it('returns undefined when the script cannot be loaded', function(done) {
    var loadScriptSpy = jasmine.createSpy('load-script').and.callFake(function(url) {
      _satellite.__registerScript(url, 'script code');
      return Promise.reject();
    });

    var getSourceUrlCode = getSourceUrlCodeInjector({
      'load-script': loadScriptSpy
    });

    getSourceUrlCode('url1').then(function(code) {
      expect(code).toBeUndefined();
      done();
    });
  });
});

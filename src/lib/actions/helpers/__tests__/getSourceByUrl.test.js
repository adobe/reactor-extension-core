'use strict';

var getSourceUrlCodeInjector = require('inject!../getSourceByUrl');
var Promise = require('@reactor/turbine/lib/require')('promise');

describe('get source by url', function() {
  var loadScriptSpy;
  var getSourceUrlCode;

  beforeAll(function() {
    loadScriptSpy = jasmine.createSpy('load-script').and.callFake(function(url) {
      _satellite.__registerScript(url, 'script code');
      return Promise.resolve();
    });

    getSourceUrlCode = getSourceUrlCodeInjector({
      'load-script': loadScriptSpy
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

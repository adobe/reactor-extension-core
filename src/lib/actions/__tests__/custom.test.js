'use strict';

var Promise = require('@adobe/composer-turbine/lib/require')('@turbine/promise');
var customInjector = require('inject!../custom');

describe('custom action delegate', function() {
  describe('before DOMContentLoaded', function() {
    var custom;
    var writeHtmlSpy;
    var postscribeSpy;

    beforeAll(function() {
      postscribeSpy = jasmine.createSpy('postscribe');
      writeHtmlSpy = jasmine.createSpy('writeHtml');

      custom = customInjector({
        '../../../node_modules/postscribe/dist/postscribe': postscribeSpy,
        '@turbine/document': {
          addEventListener: function(type, callback) {}
        },
        '@turbine/write-html': writeHtmlSpy,
        './helpers/decorateCode': function(action, source) {
          return source;
        },
        './helpers/loadCodeSequentially': function() {
          return Promise.resolve('inside external file');
        }
      });
    });

    beforeEach(function() {
      postscribeSpy.calls.reset();
      writeHtmlSpy.calls.reset();
    });

    it('writes the code defined inside the action', function(done) {
      custom({
        source: 'inside container',
        language: 'javascript'
      }).then(function() {
        expect(writeHtmlSpy).toHaveBeenCalledWith('inside container');
        expect(postscribeSpy).not.toHaveBeenCalled();
        done();
      });
    });

    it('writes the code defined inside an external file', function(done) {
      custom({
        isExternal: true,
        language: 'javascript'
      }).then(function() {
        expect(writeHtmlSpy).toHaveBeenCalledWith('inside external file');
        expect(postscribeSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('after DOMContentLoaded', function() {
    var custom;
    var postscribeSpy;
    var writeHtmlSpy;

    beforeAll(function() {
      postscribeSpy = jasmine.createSpy('postscribe');
      writeHtmlSpy = jasmine.createSpy('writeHtml');

      custom = customInjector({
        '../../../node_modules/postscribe/dist/postscribe': postscribeSpy,
        './helpers/decorateCode': function(action, source) {
          return source;
        },
        '@turbine/document': {
          addEventListener: function(type, callback) {
            if (type === 'DOMContentLoaded') {
              callback();
            }
          }
        },
        './helpers/loadCodeSequentially': function() {
          return Promise.resolve('inside external file');
        }
      });
    });

    beforeEach(function() {
      postscribeSpy.calls.reset();
      writeHtmlSpy.calls.reset();
    });

    it('writes the code defined inside an external file', function(done) {
      custom({
        isExternal: true,
        language: 'javascript'
      }).then(function() {
        expect(writeHtmlSpy).not.toHaveBeenCalled();
        expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
        done();
      });
    });
  });
});

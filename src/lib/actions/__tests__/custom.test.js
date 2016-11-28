'use strict';

var Promise = require('@reactor/turbine/lib/require')('promise');
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
        'document': {
          addEventListener: function(type, callback) {}
        },
        'write-html': writeHtmlSpy,
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
        sourceUrl: 'url1',
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
        'document': {
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
        sourceUrl: 'url2',
        language: 'javascript'
      }).then(function() {
        expect(writeHtmlSpy).not.toHaveBeenCalled();
        expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
        done();
      });
    });
  });
});

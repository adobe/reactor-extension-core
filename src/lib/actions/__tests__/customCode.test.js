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

var Promise = require('@adobe/reactor-promise');
var customCodeInjector = require('inject!../customCode');

var LAUNCH_LIB_EXAMPLE_SRC =
  'assets.adobedtm.com/launch-ENad46b63a40c84a86a0de29087f7ecb24-development.min.js';

var createCustomCodeDelegate = function(mocks) {
  return customCodeInjector({
    '../../../node_modules/postscribe/dist/postscribe': mocks.postscribe,
    '@adobe/reactor-document': mocks.document,
    './helpers/decorateCode': function(action, source) {
      return source;
    },
    './helpers/loadCodeSequentially': function() {
      return Promise.resolve('inside external file');
    }
  });
};

describe('custom code action delegate', function() {
  var documentWriteSpy;
  var postscribeSpy;
  var customCode;

  beforeAll(function() {
    postscribeSpy = jasmine.createSpy('postscribe');
    documentWriteSpy = jasmine.createSpy('documentWrite');
  });

  beforeEach(function() {
    postscribeSpy.calls.reset();
    documentWriteSpy.calls.reset();
  });

  describe('before DOMContentLoaded', function() {
    beforeAll(function() {
      customCode = createCustomCodeDelegate({
        postscribe: postscribeSpy,
        document: {
          readyState: 'loading',
          write: documentWriteSpy,
          documentElement: {}
        }
      });
    });

    it('writes the code defined inside the main library', function() {
      customCode({
        source: 'inside container',
        language: 'javascript'
      });

      expect(documentWriteSpy).toHaveBeenCalledWith('inside container');
      expect(postscribeSpy).not.toHaveBeenCalled();
    });

    it('writes the code defined inside an external file', function(done) {
      customCode({
        isExternal: true,
        source: 'http://someurl.com/source.js',
        language: 'javascript'
      }).then(function() {
        expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
        expect(documentWriteSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('after DOMContentLoaded', function() {
    beforeAll(function() {
      customCode = createCustomCodeDelegate({
        postscribe: postscribeSpy,
        document: {
          readyState: 'interactive',
          write: documentWriteSpy,
          documentElement: {}
        }
      });
    });

    it('writes the code defined inside the main library', function() {
      customCode({
        source: 'inside container',
        language: 'javascript'
      });

      expect(documentWriteSpy).not.toHaveBeenCalled();
      expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
    });

    it('writes the code defined inside an external file', function(done) {
      customCode({
        isExternal: true,
        source: 'http://someurl.com/source.js',
        language: 'javascript'
      }).then(function() {
        expect(documentWriteSpy).not.toHaveBeenCalled();
        expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
        done();
      });
    });
  });

  describe('in IE 10', function() {
    describe('library loaded synchronously', function() {
      beforeAll(function() {
        customCode = createCustomCodeDelegate({
          postscribe: postscribeSpy,
          document: {
            // In IE 10, there's a bug that sets readyState to interactive too early.
            // We need to test that we still function appropriately in this case.
            readyState: 'interactive',
            write: documentWriteSpy,
            documentElement: {
              doScroll: function() {
              }
            },
            querySelectorAll: function() {
              return [{
                src: LAUNCH_LIB_EXAMPLE_SRC
              }];
            }
          }
        });
      });

      it('writes the code defined inside the main library', function() {
        customCode({
          source: 'inside container',
          language: 'javascript'
        });

        expect(documentWriteSpy).toHaveBeenCalledWith('inside container');
        expect(postscribeSpy).not.toHaveBeenCalled();
      });

      it('writes the code defined inside an external file', function(done) {
        customCode({
          isExternal: true,
          source: 'http://someurl.com/source.js',
          language: 'javascript'
        }).then(function() {
          expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
          expect(documentWriteSpy).not.toHaveBeenCalled();
          done();
        });
      });
    });

    describe('library loaded asynchronously', function() {
      beforeAll(function() {
        customCode = createCustomCodeDelegate({
          postscribe: postscribeSpy,
          document: {
            // In IE 10, there's a bug that sets readyState to interactive too early.
            // We need to test that we still function appropriately in this case.
            readyState: 'interactive',
            write: documentWriteSpy,
            documentElement: {
              doScroll: function() {
              }
            },
            querySelectorAll: function() {
              return [{
                src: LAUNCH_LIB_EXAMPLE_SRC,
                async: true
              }];
            }
          }
        });
      });

      it('writes the code defined inside the main library', function() {
        customCode({
          source: 'inside container',
          language: 'javascript'
        });

        expect(documentWriteSpy).not.toHaveBeenCalled();
        expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
      });

      it('writes the code defined inside an external file', function(done) {
        customCode({
          isExternal: true,
          source: 'http://someurl.com/source.js',
          language: 'javascript'
        }).then(function() {
          expect(documentWriteSpy).not.toHaveBeenCalled();
          expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
          done();
        });
      });
    });

    describe('library script not found', function() {
      beforeAll(function() {
        customCode = createCustomCodeDelegate({
          postscribe: postscribeSpy,
          document: {
            // In IE 10, there's a bug that sets readyState to interactive too early.
            // We need to test that we still function appropriately in this case.
            readyState: 'interactive',
            write: documentWriteSpy,
            documentElement: {
              doScroll: function() {
              }
            },
            querySelectorAll: function() {
              return [];
            }
          }
        });
      });

      it('writes the code defined inside the main library', function() {
        customCode({
          source: 'inside container',
          language: 'javascript'
        });

        expect(documentWriteSpy).not.toHaveBeenCalled();
        expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
      });

      it('writes the code defined inside an external file', function(done) {
        customCode({
          isExternal: true,
          source: 'http://someurl.com/source.js',
          language: 'javascript'
        }).then(function() {
          expect(documentWriteSpy).not.toHaveBeenCalled();
          expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
          done();
        });
      });
    });
  });
});

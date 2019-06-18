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

var Promise = require('@adobe/reactor-promise');
var customCodeInjector = require('inject-loader!../customCode');

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

var getMockDocument = function(options) {
  var document = {
    querySelectorAll: function() {
      return [
        {
          src: options.isLibRenamed ? 'renamedlaunchlib.js' : LAUNCH_LIB_EXAMPLE_SRC,
          async: options.isAsync
        }
      ];
    },
    write: options.write,
    readyState: options.readyState
  };

  if (options.isDocumentBodyAvailable) {
    document.body = {};
  }

  if (!options.isIE) {
    document.currentScript = {
      async: options.isAsync
    };
  }

  return document;
};

describe('custom code action delegate', function() {
  var documentWriteSpy;
  var postscribeSpy;
  var customCode;

  beforeAll(function() {
    mockTurbineVariable({
      getExtensionSettings: function() {
        return {};
      }
    });

    postscribeSpy = jasmine.createSpy('postscribe');
    documentWriteSpy = jasmine.createSpy('documentWrite');
  });

  afterAll(function() {
    resetTurbineVariable();
  });

  beforeEach(function() {
    postscribeSpy.calls.reset();
    documentWriteSpy.calls.reset();
  });

  [true, false].forEach(function(isIE) {
    describe('when browser ' + (isIE ? 'is IE' : 'is not IE'), function() {
      describe('and library loaded asynchronously', function() {
        describe('and document.body is available', function() {
          beforeAll(function() {
            customCode = createCustomCodeDelegate({
              postscribe: postscribeSpy,
              document: getMockDocument({
                isIE: isIE,
                isAsync: true,
                write: documentWriteSpy,
                isDocumentBodyAvailable: true,
                readyState: 'interactive'
              })
            });
          });

          it('writes the code defined inside the main library', function() {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
            expect(documentWriteSpy).not.toHaveBeenCalled();
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

        describe('and document.body is not available', function() {
          var mockDocument;

          beforeEach(function() {
            jasmine.clock().install();

            mockDocument = getMockDocument({
              isIE: isIE,
              isAsync: true,
              write: documentWriteSpy,
              readyState: 'interactive'
            });

            customCode = createCustomCodeDelegate({
              postscribe: postscribeSpy,
              document: mockDocument
            });
          });

          afterEach(function() {
            jasmine.clock().uninstall();
          });

          it('writes the code defined inside the main library', function() {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy).not.toHaveBeenCalled();
            expect(documentWriteSpy).not.toHaveBeenCalled();

            mockDocument.body = {};
            jasmine.clock().tick(20);

            expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
            expect(documentWriteSpy).not.toHaveBeenCalled();
          });

          it('writes the code defined inside an external file', function(done) {
            customCode({
              isExternal: true,
              source: 'http://someurl.com/source.js',
              language: 'javascript'
            }).then(function() {
              expect(postscribeSpy).not.toHaveBeenCalled();
              expect(documentWriteSpy).not.toHaveBeenCalled();

              mockDocument.body = {};
              jasmine.clock().tick(20);

              expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
              expect(documentWriteSpy).not.toHaveBeenCalled();
              done();
            });
          });

          it('flushes queue when body becomes available before timeout is complete', function() {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy).not.toHaveBeenCalled();
            expect(documentWriteSpy).not.toHaveBeenCalled();

            mockDocument.body = {};

            customCode({
              source: 'inside container2',
              language: 'javascript'
            });

            expect(postscribeSpy.calls.argsFor(0)[1]).toBe('inside container');
            expect(postscribeSpy.calls.argsFor(1)[1]).toBe('inside container2');
            expect(documentWriteSpy).not.toHaveBeenCalled();
          });
        });

        describe('and document.readyState is loading', function() {
          beforeAll(function() {
            customCode = createCustomCodeDelegate({
              postscribe: postscribeSpy,
              document: getMockDocument({
                isIE: isIE,
                isAsync: true,
                write: documentWriteSpy,
                isDocumentBodyAvailable: true,
                readyState: 'loading'
              })
            });
          });

          // Just want to make sure document.write is never used when the library is
          // loaded asynchronously, even if it's before DOMContentLoaded.
          it('writes the code using postscribe', function() {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
            expect(documentWriteSpy).not.toHaveBeenCalled();
          });
        });

        describe('and the cspNonce is defined inside extension configuration', function() {
          var postscribeTag;

          beforeAll(function() {
            postscribeTag = {
              tagName: 'script',
              attrs: {}
            };

            mockTurbineVariable({
              getExtensionSettings: function() {
                return {
                  cspNonce: 'nonce'
                };
              }
            });

            customCode = createCustomCodeDelegate({
              postscribe: function(_, src, opts) {
                opts.beforeWriteToken(postscribeTag);
              },
              document: getMockDocument({
                isIE: isIE,
                isAsync: true,
                write: documentWriteSpy,
                isDocumentBodyAvailable: true,
                readyState: 'interactive'
              })
            });
          });

          it('writes the cspNonce as an attribute on all script tags', function() {
            customCode({
              source: 'some code with script tag',
              language: 'javascript'
            });

            expect(documentWriteSpy).not.toHaveBeenCalled();
            expect(postscribeTag.attrs.nonce).toBe('nonce');
          });
        });
      });

      describe('and library loaded synchronously', function() {
        describe('and document.readyState is loading', function() {
          beforeAll(function() {
            customCode = createCustomCodeDelegate({
              postscribe: postscribeSpy,
              document: getMockDocument({
                isIE: isIE,
                isAsync: false,
                write: documentWriteSpy,
                isDocumentBodyAvailable: true,
                readyState: 'loading'
              })
            });
          });

          it('writes the code defined inside the main library', function() {
            customCode({
              source: 'inside container',
              language: 'javascript',
            });

            expect(postscribeSpy).not.toHaveBeenCalled();
            expect(documentWriteSpy).toHaveBeenCalledWith('inside container');
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

        describe('and document.readyState is not loading', function() {
          beforeAll(function() {
            customCode = createCustomCodeDelegate({
              postscribe: postscribeSpy,
              document: getMockDocument({
                isIE: isIE,
                isAsync: false,
                write: documentWriteSpy,
                isDocumentBodyAvailable: true,
                readyState: 'interactive'
              })
            });
          });

          it('writes the code defined inside the main library', function() {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
            expect(documentWriteSpy).not.toHaveBeenCalled();
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
      });

      // This just tests the unlikely case where the user is in IE and we can't find the
      // script element that loaded the Launch library. This could be due to the Launch library
      // having been renamed, which is unsupported, but something we'll test for anyway.
      // In these cases, we err on the side of assuming the script is asynchronously loaded.
      if (isIE) {
        describe('and the script that loaded Launch cannot be found', function() {
          beforeAll(function() {
            customCode = createCustomCodeDelegate({
              postscribe: postscribeSpy,
              document: getMockDocument({
                isIE: isIE,
                isAsync: false,
                write: documentWriteSpy,
                isDocumentBodyAvailable: true,
                isLibRenamed: true,
                readyState: 'loading'
              })
            });
          });

          it('writes the code defined inside the main library', function() {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
            expect(documentWriteSpy).not.toHaveBeenCalled();
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
      }
    });
  });
});

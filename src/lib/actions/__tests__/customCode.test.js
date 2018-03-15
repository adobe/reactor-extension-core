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
    write: options.write
  };

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
    postscribeSpy = jasmine.createSpy('postscribe');
    documentWriteSpy = jasmine.createSpy('documentWrite');
  });

  beforeEach(function() {
    postscribeSpy.calls.reset();
    documentWriteSpy.calls.reset();
  });

  [true, false].forEach(function(isIE) {
    describe('when browser ' + (isIE ? 'is IE' : 'is not IE'), function() {
      describe('and library loaded asynchronously', function() {
        beforeAll(function() {
          customCode = createCustomCodeDelegate({
            postscribe: postscribeSpy,
            document: getMockDocument({
              isIE: isIE,
              isAsync: true,
              write: documentWriteSpy
            })
          });
        });

        it('writes the code defined inside the main library', function() {
          customCode({
            source: 'inside container',
            language: 'javascript'
          }, {
            $type: 'core.library-loaded'
          });

          expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
          expect(documentWriteSpy).not.toHaveBeenCalled();
        });

        it('writes the code defined inside an external file', function(done) {
          customCode({
            isExternal: true,
            source: 'http://someurl.com/source.js',
            language: 'javascript'
          }, {
            $type: 'core.library-loaded'
          }).then(function() {
            expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
            expect(documentWriteSpy).not.toHaveBeenCalled();
            done();
          });
        });
      });

      describe('and library loaded synchronously', function() {
        beforeAll(function() {
          customCode = createCustomCodeDelegate({
            postscribe: postscribeSpy,
            document: getMockDocument({
              isIE: isIE,
              isAsync: false,
              write: documentWriteSpy
            })
          });
        });

        ['core.library-loaded', 'core.page-bottom'].forEach(function(type) {
          describe('when event is ' + type, function() {
            it('writes the code defined inside the main library', function() {
              customCode({
                source: 'inside container',
                language: 'javascript'
              }, {
                $type: type
              });

              expect(postscribeSpy).not.toHaveBeenCalled();
              expect(documentWriteSpy).toHaveBeenCalledWith('inside container');
            });

            it('writes the code defined inside an external file', function(done) {
              customCode({
                isExternal: true,
                source: 'http://someurl.com/source.js',
                language: 'javascript'
              }, {
                $type: type
              }).then(function() {
                expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
                expect(documentWriteSpy).not.toHaveBeenCalled();
                done();
              });
            });
          });
        });

        describe('and event is not core.library-loaded or core.page-bottom', function() {
          it('writes the code defined inside the main library', function() {
            customCode({
              source: 'inside container',
              language: 'javascript'
            }, {
              $type: 'core.click'
            });

            expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
            expect(documentWriteSpy).not.toHaveBeenCalled();
          });

          it('writes the code defined inside an external file', function(done) {
            customCode({
              isExternal: true,
              source: 'http://someurl.com/source.js',
              language: 'javascript'
            }, {
              $type: 'core.click'
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
                isLibRenamed: true
              })
            });
          });

          it('writes the code defined inside the main library', function() {
            customCode({
              source: 'inside container',
              language: 'javascript'
            }, {
              $type: 'core.library-loaded'
            });

            expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside container');
            expect(documentWriteSpy).not.toHaveBeenCalled();
          });

          it('writes the code defined inside an external file', function(done) {
            customCode({
              isExternal: true,
              source: 'http://someurl.com/source.js',
              language: 'javascript'
            }, {
              $type: 'core.library-loaded'
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

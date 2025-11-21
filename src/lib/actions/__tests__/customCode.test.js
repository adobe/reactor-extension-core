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

import { injectCustomCodeAction } from '../customCode.js'
import { injectFindPageScript } from '../../helpers/findPageScript.js'
import { vi } from 'vitest';

const LAUNCH_LIB_EXAMPLE_SRC =
  'assets.adobedtm.com/launch-ENad46b63a40c84a86a0de29087f7ecb24-development.min.js';

const createCustomCodeDelegate = function (mocks) {
  return injectCustomCodeAction({
    postscribe: mocks.postscribe,
    document: mocks.document || document,
    Promise: mocks.Promise || Promise,
    decorateCode: function (action, source) {
      return {
        code: source,
        promise: Promise.resolve('promise result from inside the decorators')
      };
    },
    loadCodeSequentially:
      mocks.loadCodeSequentially ||
      function () {
        return Promise.resolve('inside external file');
      },
    getTurbineScript: injectFindPageScript({
      document: mocks.document
    }).getTurbine
  });
};

const getMockDocument = function (options) {
  const document = {
    querySelectorAll: function () {
      return [
        {
          src: options.isLibRenamed
            ? 'renamedlaunchlib.js'
            : LAUNCH_LIB_EXAMPLE_SRC,
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

describe('custom code action delegate', function () {
  let documentWriteSpy;
  let postscribeSpy;
  let customCode;

  beforeAll(() => {
    postscribeSpy = vi.fn();
    documentWriteSpy = vi.fn();
  });

  beforeEach(function () {
    mockTurbineVariable({
      propertySettings: {},
      getExtensionSettings: function () {
        return {};
      }
    });

    postscribeSpy.mockClear();
    documentWriteSpy.mockClear();
  });

  [true, false].forEach(function (isIE) {
    describe('when browser ' + (isIE ? 'is IE' : 'is not IE'), function () {
      describe('and library loaded asynchronously', function () {
        describe('and document.body is available', function () {
          beforeAll(function () {
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

          it('writes the code defined inside the main library', function () {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy.mock.lastCall[1]).toBe(
              'inside container'
            );
            expect(documentWriteSpy).not.toHaveBeenCalled();
          });

          it('writes the code defined inside an external file', async function() {
            customCode({
              isExternal: true,
              source: 'http://someurl.com/source.js',
              language: 'javascript'
            }).then(function () {
              expect(postscribeSpy.mock.lastCall[1]).toBe(
                'inside external file'
              );
              expect(documentWriteSpy).not.toHaveBeenCalled();
              
            });
          });
        });

        describe('and document.body is not available', function () {
          let mockDocument;

          beforeEach(function () {
            vi.useFakeTimers();

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

          afterEach(function () {
            vi.useRealTimers();
          });

          it('writes the code defined inside the main library', function () {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy).not.toHaveBeenCalled();
            expect(documentWriteSpy).not.toHaveBeenCalled();

            mockDocument.body = {};
            vi.advanceTimersByTime(20);

            expect(postscribeSpy.mock.lastCall[1]).toBe(
              'inside container'
            );
            expect(documentWriteSpy).not.toHaveBeenCalled();
          });

          it('writes the code defined inside an external file', async function() {
            customCode({
              isExternal: true,
              source: 'http://someurl.com/source.js',
              language: 'javascript'
            }).then(function () {
              expect(postscribeSpy).not.toHaveBeenCalled();
              expect(documentWriteSpy).not.toHaveBeenCalled();

              mockDocument.body = {};
              vi.advanceTimersByTime(20);

              expect(postscribeSpy.mock.lastCall[1]).toBe(
                'inside external file'
              );
              expect(documentWriteSpy).not.toHaveBeenCalled();
              
            });
          });

          it('flushes queue when body becomes available before timeout is complete', function () {
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

        describe('and document.readyState is loading', function () {
          beforeAll(function () {
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
          it('writes the code using postscribe', function () {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy.mock.lastCall[1]).toBe(
              'inside container'
            );
            expect(documentWriteSpy).not.toHaveBeenCalled();
          });
        });

        describe('and the cspNonce is defined inside extension configuration', function () {
          let postscribeTag;
          let extensionSettings;

          beforeEach(function () {
            postscribeTag = {
              tagName: 'script',
              attrs: {}
            };

            extensionSettings = {};

            mockTurbineVariable({
              propertySettings: {},
              getExtensionSettings: function () {
                return extensionSettings;
              }
            });

            customCode = createCustomCodeDelegate({
              postscribe: function (_, src, opts) {
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

          it('writes the cspNonce as an attribute on all script tags', function () {
            extensionSettings.cspNonce = 'nonce';

            customCode({
              source: 'some code with script tag',
              language: 'javascript'
            });

            expect(documentWriteSpy).not.toHaveBeenCalled();
            expect(postscribeTag.attrs.nonce).toBe('nonce');

            extensionSettings.cspNonce = 'nonce2';

            customCode({
              source: 'some code with script tag',
              language: 'javascript'
            });

            expect(documentWriteSpy).not.toHaveBeenCalled();
            expect(postscribeTag.attrs.nonce).toBe('nonce2');
          });
        });
      });

      describe('and library loaded synchronously', function () {
        describe('and document.readyState is loading', function () {
          beforeAll(function () {
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

          it('writes the code defined inside the main library', function () {
            mockTurbineVariable({
              propertySettings: {
                ruleComponentSequencingEnabled: false
              },
              getExtensionSettings: function () {
                return {};
              }
            });

            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy).not.toHaveBeenCalled();
            expect(documentWriteSpy).toHaveBeenCalledWith('inside container');
          });

          it('writes the code defined inside an external file', async function() {
            customCode({
              isExternal: true,
              source: 'http://someurl.com/source.js',
              language: 'javascript'
            }).then(function () {
              expect(postscribeSpy.mock.lastCall[1]).toBe(
                'inside external file'
              );
              expect(documentWriteSpy).not.toHaveBeenCalled();
              
            });
          });

          it(
            'writes the code defined inside the main library using postscribe ' +
              'when sequencing is enabled',
            async function () {
              mockTurbineVariable({
                propertySettings: {
                  ruleComponentSequencingEnabled: true
                },
                getExtensionSettings: function () {
                  return {};
                }
              });

              customCode({
                source: 'inside container',
                language: 'javascript'
              }).then(function () {
                expect(postscribeSpy.mock.lastCall[1]).toBe(
                  'inside container'
                );
                expect(documentWriteSpy).not.toHaveBeenCalled();
                
              });
            }
          );
        });

        describe('and document.readyState is not loading', function () {
          beforeAll(function () {
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

          it('writes the code defined inside the main library', function () {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy.mock.lastCall[1]).toBe(
              'inside container'
            );
            expect(documentWriteSpy).not.toHaveBeenCalled();
          });

          it('writes the code defined inside an external file', async function() {
            customCode({
              isExternal: true,
              source: 'http://someurl.com/source.js',
              language: 'javascript'
            }).then(function () {
              expect(postscribeSpy.mock.lastCall[1]).toBe(
                'inside external file'
              );
              expect(documentWriteSpy).not.toHaveBeenCalled();
              
            });
          });
        });
      });

      // This just tests the unlikely case where the user is in IE and we can't find the
      // script element that loaded the Launch library. This could be due to the Launch library
      // having been renamed, which is unsupported, but something we'll test for anyway.
      // In these cases, we err on the side of assuming the script is asynchronously loaded.
      if (isIE) {
        describe('and the script that loaded Launch cannot be found', function () {
          beforeAll(function () {
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

          it('writes the code defined inside the main library', function () {
            customCode({
              source: 'inside container',
              language: 'javascript'
            });

            expect(postscribeSpy.mock.lastCall[1]).toBe(
              'inside container'
            );
            expect(documentWriteSpy).not.toHaveBeenCalled();
          });

          it('writes the code defined inside an external file', async function() {
            customCode({
              isExternal: true,
              source: 'http://someurl.com/source.js',
              language: 'javascript'
            }).then(function () {
              expect(postscribeSpy.mock.lastCall[1]).toBe(
                'inside external file'
              );
              expect(documentWriteSpy).not.toHaveBeenCalled();
              
            });
          });
        });
      }
    });
  });

  describe('when postscribe is used', function () {
    let postscribeTag;

    beforeEach(function () {
      customCode = createCustomCodeDelegate({
        document: getMockDocument({
          write: function () {},
          isDocumentBodyAvailable: true
        }),
        postscribe: function (_, src, opts) {
          opts.beforeWriteToken(postscribeTag);
        }
      });
    });

    it(
      'decodes the HTML entities from script token attrs and src attributes ' +
        'inside beforeWriteToken callback',
      function () {
        postscribeTag = {
          tagName: 'script',
          attrs: { src: 'https://www.google.com/?id=DC&amp;l=gtmDataLayer' },
          src: 'https://www.google.com/?id=DC&amp;l=gtmDataLayer'
        };

        customCode({
          source:
            '<script src="https://www.google.com/?id=DC&amp;l=gtmDataLayer"></script>',
          language: 'html'
        });

        expect(postscribeTag.attrs.src).toBe(
          'https://www.google.com/?id=DC&l=gtmDataLayer'
        );
        expect(postscribeTag.src).toBe(
          'https://www.google.com/?id=DC&l=gtmDataLayer'
        );
      }
    );

    it(
      'decodes the HTML entities from style token attrs attribute ' +
        'inside beforeWriteToken callback',
      function () {
        postscribeTag = {
          tagName: 'style',
          attrs: { 'data-id': 'a &amp; b' }
        };

        customCode({
          source: '<style data-id="a &amp; b"></style>',
          language: 'html'
        });

        expect(postscribeTag.attrs['data-id']).toBe('a & b');
      }
    );

    it(
      'decodes the HTML entities from the token attrs attribute ' +
        'inside beforeWriteToken callback even when the tag name is uppercase',
      function () {
        postscribeTag = {
          tagName: 'STYLE',
          attrs: { 'data-id': 'a &amp; b' }
        };

        customCode({
          source: '<STYLE data-id="a &amp; b"></STYLE>',
          language: 'html'
        });

        expect(postscribeTag.attrs['data-id']).toBe('a & b');
      }
    );

    it('lets the browser decode the HTML entities from other token attrs attributes', function () {
      postscribeTag = {
        tagName: 'div',
        attrs: { 'data-id': 'a &amp; b' }
      };

      customCode({
        source: '<div data-id="a &amp; b"></div>',
        language: 'html'
      });

      expect(postscribeTag.attrs['data-id']).toBe('a &amp; b');
    });

    it('beforeWriteToken does not throw error for comments tokens', function () {
      postscribeTag = {
        content: ' comment -->',
        length: 16,
        text: '<!-- comment -->',
        type: 'comment'
      };

      expect(function () {
        customCode({
          source: '<!-- comment -->',
          language: 'html'
        });
      }).not.toThrow();
    });
  });

  describe('returns the promise received from the decorateCode module', function () {
    beforeEach(function () {
      customCode = createCustomCodeDelegate({
        postscribe: postscribeSpy,
        document: getMockDocument({})
      });
    });

    it('for the code defined inside an external file', async function() {
      customCode({
        isExternal: true,
        source: 'http://someurl.com/source.js',
        language: 'javascript'
      }).then(function (result) {
        expect(result).toBe('promise result from inside the decorators');

        
      });
    });

    it('for the code defined inside the main library', async function() {
      customCode({
        source: 'inside container',
        language: 'javascript'
      }).then(function (result) {
        expect(result).toBe('promise result from inside the decorators');

        
      });
    });
  });

  describe('returns a resolved promise', function () {
    it('for empty code defined inside an external file', async function() {
      customCode = createCustomCodeDelegate({
        postscribe: postscribeSpy,
        document: getMockDocument({}),
        loadCodeSequentially: function () {
          return Promise.resolve('');
        }
      });

      customCode({
        isExternal: true,
        source: 'http://someurl.com/source.js',
        language: 'javascript'
      }).then(function (result) {
        expect(result).toBeUndefined();

        
      });
    });
  });
});

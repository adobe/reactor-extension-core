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

var Promise = require('@adobe/reactor-turbine/lib/require')('@turbine/promise');
var customCodeInjector = require('inject!../customCode');

describe('custom action delegate', function() {
  describe('before DOMContentLoaded', function() {
    var customCode;
    var writeHtmlSpy;
    var postscribeSpy;

    beforeAll(function() {
      postscribeSpy = jasmine.createSpy('postscribe');
      writeHtmlSpy = jasmine.createSpy('writeHtml');

      customCode = customCodeInjector({
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

    it('writes the code defined inside the action', function() {
      customCode({
        source: 'inside container',
        language: 'javascript'
      });

      expect(writeHtmlSpy).toHaveBeenCalledWith('inside container');
      expect(postscribeSpy).not.toHaveBeenCalled();
    });

    it('writes the code defined inside an external file', function(done) {
      customCode({
        isExternal: true,
        source: 'http://someurl.com/source.js',
        language: 'javascript'
      }).then(function() {
        expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
        expect(writeHtmlSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('after DOMContentLoaded', function() {
    var customCode;
    var postscribeSpy;
    var writeHtmlSpy;

    beforeAll(function() {
      postscribeSpy = jasmine.createSpy('postscribe');
      writeHtmlSpy = jasmine.createSpy('writeHtml');

      customCode = customCodeInjector({
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
      customCode({
        isExternal: true,
        source: 'http://someurl.com/source.js',
        language: 'javascript'
      }).then(function() {
        expect(writeHtmlSpy).not.toHaveBeenCalled();
        expect(postscribeSpy.calls.mostRecent().args[1]).toBe('inside external file');
        done();
      });
    });
  });
});

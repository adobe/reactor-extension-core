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
  var headScriptRefs = [];
  var domain = 'https://assets.adobedtm.com';
  var filePath = '/extensions/actions.js';
  var relativeFile = '/relative/relative-action.js';
  var fullFileUrl = domain + filePath;

  beforeAll(function () {
    var fullPathRef = document.createElement('script');
    fullPathRef.src = fullFileUrl;
    document.head.appendChild(fullPathRef);
    headScriptRefs.push(fullPathRef);
    var relativePathRef = document.createElement('script');
    relativePathRef.src = relativeFile;
    document.head.appendChild(relativePathRef);
    headScriptRefs.push(relativePathRef);
  });

  afterAll(function () {
    headScriptRefs.forEach(function (ref) {
      document.head.removeChild(ref);
    });
  });

  describe(', Modern Browser Scenarios', function () {
    var currentScriptSpy;

    describe(', registerScript called with a full path', function () {
      describe(', getSourceByUrl called with a full path,', function () {
        beforeEach(function () {
          currentScriptSpy = spyOnProperty(
            document,
            'currentScript',
            'get'
          ).and.returnValue({
            src: fullFileUrl,
            getAttribute: function (key) {
              return { src: fullFileUrl }[key]; // only src supported
            }
          });

          loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              // files written out by forge will sometimes provide a relative url
              _satellite.__registerScript(fullFileUrl, 'script code');
              return Promise.resolve();
            });

          getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });
        });

        it('loads the script containing the script only once', function () {
          getSourceUrlCode(fullFileUrl);
          getSourceUrlCode(fullFileUrl);

          expect(loadScriptSpy).toHaveBeenCalledTimes(1);
          expect(currentScriptSpy).toHaveBeenCalled();
        });

        it('returns a promise that once fulfilled returns the code', function (done) {
          getSourceUrlCode(fullFileUrl).then(function (code) {
            expect(code).toBe('script code');
            expect(currentScriptSpy).toHaveBeenCalled();
            done();
          });
        });

        it('returns undefined when the script cannot be loaded', function (done) {
          var loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              return Promise.reject();
            });

          var getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });

          getSourceUrlCode(fullFileUrl).then(function (code) {
            expect(code).toBeUndefined();
            expect(currentScriptSpy).not.toHaveBeenCalled();
            done();
          });
        });
      });
    });

    describe(', registerScript called with a partial path', function () {
      describe(', getSourceByUrl called with a partial path,', function () {
        beforeEach(function () {
          currentScriptSpy = spyOnProperty(
            document,
            'currentScript',
            'get'
          ).and.returnValue({
            src: 'https://somedomain.com' + relativeFile,
            getAttribute: function (key) {
              return { src: relativeFile }[key]; // only src supported
            }
          });

          loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              // files written out by forge will sometimes provide a relative url
              _satellite.__registerScript(relativeFile, 'script code');
              return Promise.resolve();
            });

          getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });
        });

        it('loads the script containing the script only once', function () {
          getSourceUrlCode(relativeFile);
          getSourceUrlCode(relativeFile);

          expect(loadScriptSpy).toHaveBeenCalledTimes(1);
          expect(currentScriptSpy).toHaveBeenCalled();
        });

        it('returns a promise that once fulfilled returns the code', function (done) {
          getSourceUrlCode(relativeFile).then(function (code) {
            expect(code).toBe('script code');
            expect(currentScriptSpy).toHaveBeenCalled();
            done();
          });
        });

        it('returns undefined when the script cannot be loaded', function (done) {
          var loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              return Promise.reject();
            });

          var getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });

          getSourceUrlCode(fullFileUrl).then(function (code) {
            expect(code).toBeUndefined();
            expect(currentScriptSpy).not.toHaveBeenCalled();
            done();
          });
        });
      });

      describe(', getSourceByUrl called with full url,', function () {
        beforeEach(function () {
          currentScriptSpy = spyOnProperty(
            document,
            'currentScript',
            'get'
          ).and.returnValue({
            src: fullFileUrl,
            getAttribute: function (key) {
              return { src: fullFileUrl }[key]; // only src supported
            }
          });

          loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              // files written out by forge will sometimes provide a relative url
              _satellite.__registerScript(filePath, 'script code');
              return Promise.resolve();
            });

          getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });
        });

        it('loads the script containing the script only once', function () {
          getSourceUrlCode(fullFileUrl);
          getSourceUrlCode(fullFileUrl);

          expect(loadScriptSpy).toHaveBeenCalledTimes(1);
          expect(currentScriptSpy).toHaveBeenCalled();
        });

        it('returns a promise that once fulfilled returns the code', function (done) {
          getSourceUrlCode(fullFileUrl).then(function (code) {
            expect(code).toBe('script code');
            expect(currentScriptSpy).toHaveBeenCalled();
            done();
          });
        });

        it('returns undefined when the script cannot be loaded', function (done) {
          var loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              return Promise.reject();
            });

          var getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });

          getSourceUrlCode(fullFileUrl).then(function (code) {
            expect(code).toBeUndefined();
            expect(currentScriptSpy).not.toHaveBeenCalled();
            done();
          });
        });
      });
    });
  });

  describe(', IE Scenarios', function () {
    describe(', registerScript called with a full path', function () {
      describe(', getSourceByUrl called with a full path,', function () {
        beforeEach(function () {
          loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              // files written out by forge will sometimes provide a relative url
              _satellite.__registerScript(fullFileUrl, 'script code');
              return Promise.resolve();
            });

          getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });
        });

        it('loads the script containing the script only once', function () {
          getSourceUrlCode(fullFileUrl);
          getSourceUrlCode(fullFileUrl);

          expect(loadScriptSpy).toHaveBeenCalledTimes(1);
        });

        it('returns a promise that once fulfilled returns the code', function (done) {
          getSourceUrlCode(fullFileUrl).then(function (code) {
            expect(code).toBe('script code');
            done();
          });
        });

        it('returns undefined when the script cannot be loaded', function (done) {
          var loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              return Promise.reject();
            });

          var getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });

          getSourceUrlCode(fullFileUrl).then(function (code) {
            expect(code).toBeUndefined();
            done();
          });
        });
      });
    });

    describe(', registerScript called with a partial path', function () {
      describe(', getSourceByUrl called with a partial path,', function () {
        beforeEach(function () {
          loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              // files written out by forge will sometimes provide a relative url
              _satellite.__registerScript(relativeFile, 'script code');
              return Promise.resolve();
            });

          getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });
        });

        it('loads the script containing the script only once', function () {
          getSourceUrlCode(relativeFile);
          getSourceUrlCode(relativeFile);

          expect(loadScriptSpy).toHaveBeenCalledTimes(1);
        });

        it('returns a promise that once fulfilled returns the code', function (done) {
          getSourceUrlCode(relativeFile).then(function (code) {
            expect(code).toBe('script code');
            done();
          });
        });

        it('returns undefined when the script cannot be loaded', function (done) {
          var loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              return Promise.reject();
            });

          var getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });

          getSourceUrlCode(fullFileUrl).then(function (code) {
            expect(code).toBeUndefined();
            done();
          });
        });
      });

      describe(', getSourceByUrl called with full url,', function () {
        beforeEach(function () {
          loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              // files written out by forge will sometimes provide a relative url
              _satellite.__registerScript(filePath, 'script code');
              return Promise.resolve();
            });

          getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });
        });

        it('loads the script containing the script only once', function () {
          getSourceUrlCode(fullFileUrl);
          getSourceUrlCode(fullFileUrl);

          expect(loadScriptSpy).toHaveBeenCalledTimes(1);
        });

        it('returns a promise that once fulfilled returns the code', function (done) {
          getSourceUrlCode(fullFileUrl).then(function (code) {
            expect(code).toBe('script code');
            done();
          });
        });

        it('returns undefined when the script cannot be loaded', function (done) {
          var loadScriptSpy = jasmine
            .createSpy('load-script')
            .and.callFake(function () {
              return Promise.reject();
            });

          var getSourceUrlCode = getSourceUrlCodeInjector({
            '@adobe/reactor-load-script': loadScriptSpy
          });

          getSourceUrlCode(fullFileUrl).then(function (code) {
            expect(code).toBeUndefined();
            done();
          });
        });
      });
    });
  });
});

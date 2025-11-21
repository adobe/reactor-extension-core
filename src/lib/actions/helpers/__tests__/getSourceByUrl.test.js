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

import { injectGetSourceByUrl } from '../getSourceByUrl.js';

describe('get source by url', function () {
  let loadScriptSpy;
  let getSourceUrlCode;
  const headScriptRefs = [];
  const domain = 'https://assets.adobedtm.com';
  const filePath = '/extensions/actions.js';
  const relativeFile = '/relative/relative-action.js';
  const fullFileUrl = domain + filePath;

  beforeAll(function () {
    const fullPathRef = document.createElement('script');
    fullPathRef.src = fullFileUrl;
    document.head.appendChild(fullPathRef);
    headScriptRefs.push(fullPathRef);
    const relativePathRef = document.createElement('script');
    relativePathRef.src = relativeFile;
    document.head.appendChild(relativePathRef);
    headScriptRefs.push(relativePathRef);
  });

  afterEach(() => {
    // this ensures that spys are restored after each test
    vi.restoreAllMocks();
  });

  afterAll(function () {
    headScriptRefs.forEach(function (ref) {
      document.head.removeChild(ref);
    });
  });

  describe(', Modern Browser Scenarios', function () {
    let currentScriptSpy;

    describe(', registerScript called with a full path', function () {
      describe(', getSourceByUrl called with a full path,', function () {
        beforeEach(function () {
          currentScriptSpy = vi
            .spyOn(document, 'currentScript', 'get')
            .mockReturnValue({
              src: fullFileUrl,
              getAttribute: function (key) {
                return { src: fullFileUrl }[key]; // only src supported
              }
            });

          loadScriptSpy = vi.fn().mockImplementation(function () {
            // files written out by forge will sometimes provide a relative url
            window.window._satellite.__registerScript(fullFileUrl, 'script code');
            return Promise.resolve();
          });

          getSourceUrlCode = injectGetSourceByUrl({
            loadScript: loadScriptSpy,
            window,
            Promise
          });
        });

        it('loads the script containing the script only once', function () {
          getSourceUrlCode(fullFileUrl);
          getSourceUrlCode(fullFileUrl);

          expect(loadScriptSpy).toHaveBeenCalledTimes(1);
          expect(currentScriptSpy).toHaveBeenCalled();
        });

        it('returns a promise that once fulfilled returns the code', async function () {
          const code = await getSourceUrlCode(fullFileUrl);
          expect(code).toBe('script code');
          expect(currentScriptSpy).toHaveBeenCalled();
        });

        it('returns undefined when the script cannot be loaded', async function () {
          const loadScriptSpy = vi.fn().mockImplementation(function () {
            return Promise.reject();
          });

          const getSourceUrlCode = injectGetSourceByUrl({
            loadScript: loadScriptSpy,
            window,
            Promise
          });

          const code = await getSourceUrlCode(fullFileUrl);
          expect(code).toBeUndefined();
          expect(currentScriptSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe(', IE Scenarios', function () {
    describe(', registerScript called with a full path', function () {
      describe(', getSourceByUrl called with a full path,', function () {
        beforeEach(function () {
          loadScriptSpy = vi.fn().mockImplementation(function () {
            // files written out by forge will sometimes provide a relative url
            window._satellite.__registerScript(fullFileUrl, 'script code');
            return Promise.resolve();
          });

          getSourceUrlCode = injectGetSourceByUrl({
            loadScript: loadScriptSpy,
            window,
            Promise
          });
        });

        it('loads the script containing the script only once', function () {
          getSourceUrlCode(fullFileUrl);
          getSourceUrlCode(fullFileUrl);

          expect(loadScriptSpy).toHaveBeenCalledTimes(1);
        });

        it('returns a promise that once fulfilled returns the code', async function () {
          const code = await getSourceUrlCode(fullFileUrl);
          expect(code).toBe('script code');
        });

        it('returns undefined when the script cannot be loaded', async function () {
          const loadScriptSpy = vi.fn().mockImplementation(function () {
            return Promise.reject();
          });

          const getSourceUrlCode = injectGetSourceByUrl({
            loadScript: loadScriptSpy,
            window,
            Promise
          });

          const code = await getSourceUrlCode(fullFileUrl);
          expect(code).toBeUndefined();
        });
      });
    });

    // in IE there is no document.currentScript, so it uses the regex pattern to find the script
    describe(', registerScript called with a partial path', function () {
      describe(', getSourceByUrl called with a partial path,', function () {
        beforeEach(function () {
          loadScriptSpy = vi.fn().mockImplementation(function () {
            // files written out by forge will sometimes provide a relative url
            window._satellite.__registerScript(relativeFile, 'script code');
            return Promise.resolve();
          });

          getSourceUrlCode = injectGetSourceByUrl({
            loadScript: loadScriptSpy,
            window,
            Promise
          });
        });

        it('loads the script containing the script only once', function () {
          getSourceUrlCode(relativeFile);
          getSourceUrlCode(relativeFile);

          expect(loadScriptSpy).toHaveBeenCalledTimes(1);
        });

        it('returns a promise that once fulfilled returns the code', async function () {
          getSourceUrlCode(relativeFile).then(function (code) {
            expect(code).toBe('script code');
          });
        });

        it('returns undefined when the script cannot be loaded', async function () {
          const loadScriptSpy = vi.fn().mockImplementation(function () {
            return Promise.reject();
          });

          const getSourceUrlCode = injectGetSourceByUrl({
            loadScript: loadScriptSpy,
            window,
            Promise
          });

          const code = await getSourceUrlCode(fullFileUrl);
          expect(code).toBeUndefined();
        });
      });

      describe(', getSourceByUrl called with full url,', function () {
        beforeEach(function () {
          loadScriptSpy = vi.fn().mockImplementation(function () {
            // files written out by forge will sometimes provide a relative url
            window._satellite.__registerScript(filePath, 'script code');
            return Promise.resolve();
          });

          getSourceUrlCode = injectGetSourceByUrl({
            loadScript: loadScriptSpy,
            window,
            Promise
          });
        });

        it('loads the script containing the script only once', function () {
          getSourceUrlCode(fullFileUrl);
          getSourceUrlCode(fullFileUrl);

          expect(loadScriptSpy).toHaveBeenCalledTimes(1);
        });

        it('returns a promise that once fulfilled returns the code', async function () {
          const code = await getSourceUrlCode(fullFileUrl);
          expect(code).toBe('script code');
        });

        it('returns undefined when the script cannot be loaded', async function () {
          const loadScriptSpy = vi.fn().mockImplementation(function () {
            return Promise.reject();
          });

          const getSourceUrlCode = injectGetSourceByUrl({
            loadScript: loadScriptSpy,
            window,
            Promise
          });

          const code = await getSourceUrlCode(fullFileUrl);
          expect(code).toBeUndefined();
        });
      });
    });
  });
});

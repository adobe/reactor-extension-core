/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { injectDecorateGlobalJavaScriptCode } from '../decorateGlobalJavaScriptCode.js';

describe('decorate global javascript code', function () {
  it('returns the decorated code on the code key', function () {
    const settings = {
      language: 'javascript',
      global: true,
      source: 'console.log("logging")'
    };

    const decorateGlobalJavaScriptCode = injectDecorateGlobalJavaScriptCode({
      Promise
    });
    const decoratedResult = decorateGlobalJavaScriptCode(
      {
        settings: settings
      },
      settings.source
    );

    expect(decoratedResult.code).toBe(
      '<script>\nconsole.log("logging")\n</script>'
    );
  });

  it('returns a resolved promise on the promise key', function () {
    const settings = {
      language: 'javascript',
      global: true,
      source: 'console.log("logging")'
    };

    var p = Promise.resolve();
    var decorateGlobalJavaScriptCode = injectDecorateGlobalJavaScriptCode({
      Promise: {
        resolve: function () {
          return p;
        }
      }
    });

    const decoratedResult = decorateGlobalJavaScriptCode(
      {
        settings: settings
      },
      settings.source
    );

    expect(decoratedResult.promise).toBe(p);
  });
});

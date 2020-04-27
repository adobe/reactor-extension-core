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

'use strict';

var decorateGlobalJavaScriptCodeInjector = require('inject-loader!../decorateGlobalJavaScriptCode');

describe('decorate global javascript code', function() {
  it('returns the decorated code on the code key', function() {
    var settings = {
      language: 'javascript',
      global: true,
      source: 'console.log("logging")'
    };

    var decorateGlobalJavaScriptCode = decorateGlobalJavaScriptCodeInjector();
    var decoratedResult = decorateGlobalJavaScriptCode(
      {
        settings: settings
      },
      settings.source
    );

    expect(decoratedResult.code).toBe(
      '<script>\nconsole.log("logging")\n</script>'
    );
  });

  it('returns a resolved promise on the promise key', function() {
    var settings = {
      language: 'javascript',
      global: true,
      source: 'console.log("logging")'
    };

    var p = Promise.resolve();
    var decorateGlobalJavaScriptCode = decorateGlobalJavaScriptCodeInjector({
      '@adobe/reactor-promise': {
        resolve: function() {
          return p;
        }
      }
    });

    var decoratedResult = decorateGlobalJavaScriptCode(
      {
        settings: settings
      },
      settings.source
    );

    expect(decoratedResult.promise).toBe(p);
  });
});

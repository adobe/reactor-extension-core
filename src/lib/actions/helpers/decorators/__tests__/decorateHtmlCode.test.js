import { vi } from 'vitest';
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

import { injectDecorateHtmlCode } from '../decorateHtmlCode.js'
import flushPromiseChains from '../../../../__tests__/helpers/flushPromiseChains.js'

describe('decorate html code', function () {
  let decorateHtmlCode;
  beforeEach(function () {
    mockTurbineVariable({
      replaceTokens: vi.fn().and.callFake(function (token) {
        return token.replace(/%(.+?)%/g, function (token, variableName) {
          return 'replaced - ' + variableName;
        });
      })
    });

    decorateHtmlCode = injectDecorateHtmlCode({
      window,
      Promise
    });
  });

  it('returns the decorated code on the code key', function () {
    const settings = {
      language: 'html',
      source: '<script>console.log("logging")</script>'
    };

    const decoratedResult = decorateHtmlCode(
      {
        settings: settings,
        event: {}
      },
      settings.source
    );

    expect(decoratedResult.code).toBe(
      '<script>console.log("logging")</script>'
    );
  });

  it('returns the decorated code with replaced callback ids if they exist', function () {
    const settings = {
      language: 'html',
      source:
        '<script>_satellite._onCustomCodeSuccess("${reactorCallbackId}")</script>'
    };

    const decoratedResult = decorateHtmlCode(
      {
        settings: settings,
        event: {}
      },
      settings.source
    );

    expect(decoratedResult.code).toBe(
      '<script>_satellite._onCustomCodeSuccess("0")</script>'
    );
  });

  it('does not replace data element tokens for an embedded html action', function () {
    const settings = {
      language: 'html',
      source: '<div>%productname%</div>'
    };

    const decoratedResult = decorateHtmlCode(
      {
        settings: settings,
        event: {},
        relatedElement: {}
      },
      settings.source
    );

    expect(decoratedResult.code).toBe('<div>%productname%</div>');
    expect(mockTurbine.replaceTokens).not.toHaveBeenCalled();
  });

  it('does replace data element tokens for an html action loaded from a file', function () {
    const settings = {
      language: 'html',
      source: 'url1',
      isExternal: true
    };

    const decoratedResult = decorateHtmlCode(
      {
        settings: settings,
        event: {},
        relatedElement: {}
      },
      '<div>%productname%</div>'
    );

    expect(decoratedResult.code).toBe('<div>replaced - productname</div>');
  });

  it(
    'returns a resolved promise on the promise key when HTML code ' +
      'does not contain callbacks',
    function () {
      const settings = {
        language: 'html',
        source: '<script>console.log("logging")</script>'
      };

      const p = Promise.resolve();
      const decorateHtmlCodeWithMockPromise = injectDecorateHtmlCode({
        window,
        Promise: { resolve: () => p }
      });

      const decoratedResult = decorateHtmlCodeWithMockPromise(
        {
          settings: settings
        },
        settings.source
      );

      expect(decoratedResult.promise).toBe(p);
    }
  );

  it(
    'returns a promise that will be resolved when HTML code contains callbacks' +
      'and _satellite._onCustomCodeSuccess is called',
    async function () {
      const settings = {
        language: 'html',
        source:
          '<script>_satellite._onCustomCodeSuccess("${reactorCallbackId}")</script>'
      };

      const onPromiseResolved = vi.fn();
      const decorateCodePromise = decorateHtmlCode(
        {
          settings: settings
        },
        settings.source
      ).promise;

      const promise = decorateCodePromise.then(onPromiseResolved);

      await flushPromiseChains();
      expect(onPromiseResolved).not.toHaveBeenCalled();
      window._satellite._onCustomCodeSuccess('0');
      
      await promise;
    }
  );

  it(
    'returns a promise that will be rejected when HTML code contains callbacks' +
      'and _satellite._onCustomCodeFailure is called',
    async function () {
      const settings = {
        language: 'html',
        source:
          '<script>_satellite._onCustomCodeFailure("${reactorCallbackId}")</script>'
      };

      const onPromiseRejected = vi.fn();
      const decorateCodePromise = decorateHtmlCode(
        {
          settings: settings
        },
        settings.source
      ).promise;

      const promise = decorateCodePromise.catch(onPromiseRejected);

      await flushPromiseChains();
      expect(onPromiseRejected).not.toHaveBeenCalled();
      window._satellite._onCustomCodeFailure('0');
      
      await promise;
    }
  );
});

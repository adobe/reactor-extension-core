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

import { createDecorateHtmlCode } from '../decorateHtmlCode';
import flushPromiseChains from '../../../../__tests__/helpers/flushPromiseChains.js';

function createMockTurbine() {
  return {
    replaceTokens: jasmine.createSpy().and.callFake(function (token) {
      return token.replace(/%(.+?)%/g, function (token, variableName) {
        return 'replaced - ' + variableName;
      });
    })
  };
}

describe('decorate html code', function () {
  let mockTurbine;
  let decorateHtmlCode;
  let satellite;

  beforeEach(function () {
    mockTurbine = createMockTurbine();
    satellite = {};
    decorateHtmlCode = createDecorateHtmlCode({
      Promise,
      turbine: mockTurbine,
      satellite
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
      const decorateHtmlCodeWithMockPromise = createDecorateHtmlCode({
        Promise: { resolve: () => p },
        turbine: mockTurbine,
        satellite
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
    function (done) {
      const settings = {
        language: 'html',
        source:
          '<script>_satellite._onCustomCodeSuccess("${reactorCallbackId}")</script>'
      };

      const onPromiseResolved = jasmine.createSpy('onPromiseResolved');
      const decorateCodePromise = decorateHtmlCode(
        {
          settings: settings
        },
        settings.source
      ).promise;

      decorateCodePromise.then(onPromiseResolved).then(done);

      flushPromiseChains().then(function () {
        expect(onPromiseResolved).not.toHaveBeenCalled();
        satellite._onCustomCodeSuccess('0');
      });
    }
  );

  it(
    'returns a promise that will be rejected when HTML code contains callbacks' +
      'and _satellite._onCustomCodeFailure is called',
    function (done) {
      const settings = {
        language: 'html',
        source:
          '<script>_satellite._onCustomCodeFailure("${reactorCallbackId}")</script>'
      };

      const onPromiseRejected = jasmine.createSpy('onPromiseRejected');
      const decorateCodePromise = decorateHtmlCode(
        {
          settings: settings
        },
        settings.source
      ).promise;

      decorateCodePromise.catch(onPromiseRejected).then(done);

      flushPromiseChains().then(function () {
        expect(onPromiseRejected).not.toHaveBeenCalled();
        satellite._onCustomCodeFailure('0');
      });
    }
  );
});

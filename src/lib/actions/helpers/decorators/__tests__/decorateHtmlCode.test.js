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

var decorateHtmlCodeInjector = require('inject-loader!../decorateHtmlCode');
var flushPromiseChains = require('../../../../__tests__/helpers/flushPromiseChains');

describe('decorate html code', function () {
  var mockTurbine;

  beforeEach(function () {
    mockTurbine = {
      replaceTokens: jasmine.createSpy().and.callFake(function (token) {
        return token.replace(/%(.+?)%/g, function (token, variableName) {
          return 'replaced - ' + variableName;
        });
      })
    };

    mockTurbineVariable(mockTurbine);
  });

  afterEach(function () {
    resetTurbineVariable();
  });

  it('returns the decorated code on the code key', function () {
    var settings = {
      language: 'html',
      source: '<script>console.log("logging")</script>'
    };

    var decorateHtmlCode = decorateHtmlCodeInjector();
    var decoratedResult = decorateHtmlCode(
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
    var settings = {
      language: 'html',
      source:
        '<script>_satellite._onCustomCodeSuccess("${reactorCallbackId}")</script>'
    };

    var decorateHtmlCode = decorateHtmlCodeInjector();
    var decoratedResult = decorateHtmlCode(
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
    var settings = {
      language: 'html',
      source: '<div>%productname%</div>'
    };

    var decorateHtmlCode = decorateHtmlCodeInjector();
    var decoratedResult = decorateHtmlCode(
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
    var settings = {
      language: 'html',
      source: 'url1',
      isExternal: true
    };

    var decorateHtmlCode = decorateHtmlCodeInjector();
    var decoratedResult = decorateHtmlCode(
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
      var settings = {
        language: 'html',
        source: '<script>console.log("logging")</script>'
      };

      var p = Promise.resolve();
      var decorateHtmlCode = decorateHtmlCodeInjector({
        '@adobe/reactor-promise': {
          resolve: function () {
            return p;
          }
        }
      });

      var decoratedResult = decorateHtmlCode(
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
      var settings = {
        language: 'html',
        source:
          '<script>_satellite._onCustomCodeSuccess("${reactorCallbackId}")</script>'
      };

      var decorateHtmlCode = decorateHtmlCodeInjector();

      var onPromiseResolved = jasmine.createSpy('onPromiseResolved');
      var decorateCodePromise = decorateHtmlCode(
        {
          settings: settings
        },
        settings.source
      ).promise;

      decorateCodePromise.then(onPromiseResolved).then(done);

      flushPromiseChains().then(function () {
        expect(onPromiseResolved).not.toHaveBeenCalled();
        window._satellite._onCustomCodeSuccess('0');
      });
    }
  );

  it(
    'returns a promise that will be rejected when HTML code contains callbacks' +
      'and _satellite._onCustomCodeFailure is called',
    function (done) {
      var settings = {
        language: 'html',
        source:
          '<script>_satellite._onCustomCodeFailure("${reactorCallbackId}")</script>'
      };

      var decorateHtmlCode = decorateHtmlCodeInjector();
      var onPromiseRejected = jasmine.createSpy('onPromiseRejected');
      var decorateCodePromise = decorateHtmlCode(
        {
          settings: settings
        },
        settings.source
      ).promise;

      decorateCodePromise.catch(onPromiseRejected).then(done);

      flushPromiseChains().then(function () {
        expect(onPromiseRejected).not.toHaveBeenCalled();
        window._satellite._onCustomCodeFailure('0');
      });
    }
  );
});

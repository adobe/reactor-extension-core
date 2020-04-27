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

var decorateNonGlobalJavaScriptCodeInjector = require('inject-loader!../decorateNonGlobalJavaScriptCode');

describe('decorate non global javascript code', function() {
  it('decorates javascript action and returns it on the code key', function() {
    var settings = {
      language: 'javascript',
      source: 'console.log("logging")'
    };

    var decorateNonGlobalJavaScriptCode = decorateNonGlobalJavaScriptCodeInjector();
    var decoratedResult = decorateNonGlobalJavaScriptCode(
      {
        settings: settings,
        event: {}
      },
      settings.source
    );

    expect(decoratedResult.code).toBe(
      '<script>_satellite["_runScript1"]' +
        '(function(event, target, Promise) {\nconsole.log("logging")\n});' +
        '</script>'
    );
  });

  it(
    'sends the event, target and our Promise to the random generated method ' +
      'for a javascript action',
    function() {
      var event = {
        element: {},
        target: {}
      };

      var settings = {
        language: 'javascript',
        source: 'console.log("logging")'
      };
      var spy = jasmine.createSpy('fn');

      var mockPromise = function(fn) {
        return new Promise(fn);
      };

      var decorateNonGlobalJavaScriptCode = decorateNonGlobalJavaScriptCodeInjector(
        {
          '@adobe/reactor-promise': mockPromise
        }
      );

      decorateNonGlobalJavaScriptCode(
        {
          settings: settings,
          event: event
        },
        settings.source
      );

      _satellite['_runScript1'](spy);

      expect(spy.calls.mostRecent()).toEqual({
        object: event.element,
        args: [event, event.target, mockPromise],
        invocationOrder: jasmine.any(Number),
        returnValue: undefined
      });
    }
  );

  it('clears the random generated method for a javascript action after its execution', function() {
    var settings = {
      language: 'javascript',
      source: 'console.log("logging")'
    };

    var decorateNonGlobalJavaScriptCode = decorateNonGlobalJavaScriptCodeInjector();
    decorateNonGlobalJavaScriptCode(
      {
        settings: settings,
        event: {},
        relatedElement: {}
      },
      settings.source
    );

    expect(_satellite['_runScript1']).toBeDefined();
    _satellite['_runScript1'](function() {});
    expect(_satellite['_runScript1']).not.toBeDefined();
  });

  it('handles javascript code that returns promises that resolve', function(done) {
    var settings = {
      language: 'javascript',
      // This code here is present only for example purposes. The code is not written to the page,
      // so it cannot be tested. The code that is tested is inside the callback that is sent to
      // _satellite['_runScript1'].
      source: 'return new Promise(function() {...})'
    };

    var decorateNonGlobalJavaScriptCode = decorateNonGlobalJavaScriptCodeInjector();

    decorateNonGlobalJavaScriptCode(
      {
        settings: settings,
        event: {}
      },
      settings.source
    ).promise.then(function(r) {
      expect(r).toBe('resolved from inside the promise');
      done();
    });

    _satellite['_runScript1'](function(event, target, Promise) {
      return new Promise(function(resolve, reject) {
        resolve('resolved from inside the promise');
      });
    });
  });

  it('handles javascript code that returns promises that reject', function(done) {
    var settings = {
      language: 'javascript',
      // This code here is present only for example purposes. The code is not written to the page,
      // so it cannot be tested. The code that is tested is inside the callback that is sent to
      // _satellite['_runScript1'].
      source: 'return new Promise(function() {...})'
    };

    var decorateNonGlobalJavaScriptCode = decorateNonGlobalJavaScriptCodeInjector();

    decorateNonGlobalJavaScriptCode(
      {
        settings: settings,
        event: {}
      },
      settings.source
    ).promise.catch(function(r) {
      expect(r).toBe('rejected from inside the promise');
      done();
    });

    _satellite['_runScript1'](function(event, target, Promise) {
      return new Promise(function(resolve, reject) {
        reject('rejected from inside the promise');
      });
    });
  });

  it('handles javascript code that throws error', function(done) {
    var settings = {
      language: 'javascript',
      // This code here is present only for example purposes. The code is not written to the page,
      // so it cannot be tested. The code that is tested is inside the callback that is sent to
      // _satellite['_runScript1'].
      source: 'return new Promise(function() {...})'
    };

    var decorateNonGlobalJavaScriptCode = decorateNonGlobalJavaScriptCodeInjector();

    decorateNonGlobalJavaScriptCode(
      {
        settings: settings,
        event: {}
      },
      settings.source
    ).promise.catch(function(e) {
      expect(e.message).toBe('error from inside code');
      done();
    });

    _satellite['_runScript1'](function() {
      throw new Error('error from inside code');
    });
  });

  it('returns a promise on the promise key', function() {
    var settings = {
      language: 'javascript',
      source: 'console.log("logging")'
    };

    var p = Promise.resolve();
    var decorateNonGlobalJavaScriptCode = decorateNonGlobalJavaScriptCodeInjector(
      {
        '@adobe/reactor-promise': function() {
          return p;
        }
      }
    );

    var decoratedResult = decorateNonGlobalJavaScriptCode(
      {
        settings: settings
      },
      settings.source
    );

    expect(decoratedResult.promise).toBe(p);
  });
});

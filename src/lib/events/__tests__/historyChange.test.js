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

describe('history change event delegate', function () {
  var delegate;
  var origHref = window.location.href;

  var assertTriggerCall = function (call) {
    expect(call.args.length).toBe(0);
  };

  beforeAll(function () {
    delegate = require('../historyChange');
  });

  afterAll(function () {
    // Just so the URL goes back to what it was. That way when we refresh the browser when
    // debugging it actually loads the correct url.
    if (window.history.replaceState) {
      window.history.replaceState(null, null, origHref);
    } else {
      window.location.hash = '';
    }
  });

  it('triggers rule on the hash change event', function (done) {
    var trigger = jasmine.createSpy();
    delegate({}, trigger);

    window.location.hash = 'hashchange-' + Math.floor(Math.random() * 100);

    // The hashchange event seems to be triggered asynchronously by the browser.
    waitUntil(function () {
      return trigger.calls.count() > 0;
    }).then(function () {
      expect(trigger.calls.count()).toBe(1);
      assertTriggerCall(trigger.calls.mostRecent());
      done();
    });
  });

  if (window.history.pushState) {
    it('triggers rule when pushState is called and on the popstate event', function (done) {
      var trigger = jasmine.createSpy();
      delegate({}, trigger);

      window.history.pushState({ some: 'state' }, null, 'pushStateTest.html');

      waitUntil(function () {
        return trigger.calls.count() > 0;
      }).then(function () {
        expect(trigger.calls.count()).toBe(1);
        assertTriggerCall(trigger.calls.mostRecent());

        window.history.back(); // This causes the popstate event.

        // The popstate event seems to be triggered asynchronously by the browser.
        waitUntil(function () {
          return trigger.calls.count() > 1;
        }).then(function () {
          expect(trigger.calls.count()).toBe(2);
          assertTriggerCall(trigger.calls.mostRecent());
          done();
        });
      });
    });
  }

  if (window.history.replaceState) {
    it('triggers rule when replaceState is called', function (done) {
      var trigger = jasmine.createSpy();
      delegate({}, trigger);

      window.history.replaceState(
        { some: 'state' },
        null,
        'replaceStateTest.html'
      );

      waitUntil(function () {
        return trigger.calls.count() > 0;
      }).then(function () {
        expect(trigger.calls.count()).toBe(1);
        assertTriggerCall(trigger.calls.mostRecent());
        done();
      });
    });
  }
});

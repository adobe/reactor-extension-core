/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

describe('locationchange event type', function() {
  var delegate;
  var origHref = window.location.href;

  var assertTriggerCall = function(call) {
    expect(call.args[0]).toBe(document);
    expect(call.args[1].type).toBe('locationchange');
    expect(call.args[1].target).toBe(document);
  };

  beforeAll(function() {
    delegate = require('../locationChange');
  });

  afterAll(function() {
    // Just so the URL goes back to what it was. That way when we refresh the browser when
    // debugging it actually loads the correct url.
    if (window.history.replaceState) {
      window.history.replaceState(null, null, origHref);
    } else {
      window.location.hash = '';
    }
  });

  it('triggers rule on the hash change event', function(done) {
    var trigger = jasmine.createSpy();
    delegate({}, trigger);

    window.location.hash = 'hashchange-' + Math.floor(Math.random() * 100);

    // The hashchange event seems to be triggered asynchronously by the browser.
    waitUntil(function() {
      return trigger.calls.count() > 0;
    }).then(function() {
      expect(trigger.calls.count()).toBe(1);
      assertTriggerCall(trigger.calls.mostRecent());
      done();
    });
  });


  if (window.history.pushState) {
    it('triggers rule when pushState is called and on the popstate event', function(done) {
      var trigger = jasmine.createSpy();
      delegate({}, trigger);

      window.history.pushState({some: 'state'}, null, 'pushStateTest.html');

      waitUntil(function() {
        return trigger.calls.count() > 0;
      }).then(function() {
        expect(trigger.calls.count()).toBe(1);
        assertTriggerCall(trigger.calls.mostRecent());

        window.history.back(); // This causes the popstate event.

        // The popstate event seems to be triggered asynchronously by the browser.
        waitUntil(function() {
          return trigger.calls.count() > 1;
        }).then(function() {
          expect(trigger.calls.count()).toBe(2);
          assertTriggerCall(trigger.calls.mostRecent());
          done();
        });
      });
    });
  }

  if (window.history.replaceState) {
    it('triggers rule when replaceState is called', function(done) {
      var trigger = jasmine.createSpy();
      delegate({}, trigger);

      window.history.replaceState({some: 'state'}, null, 'replaceStateTest.html');

      waitUntil(function() {
        return trigger.calls.count() > 0;
      }).then(function() {
        expect(trigger.calls.count()).toBe(1);
        assertTriggerCall(trigger.calls.mostRecent());
        done();
      });
    });
  }

});

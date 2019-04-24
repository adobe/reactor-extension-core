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

var millisByUnit = {
  second: 1000,
  minute: 60000, // 60 seconds
  hour: 3600000, // 60 minutes
  day: 86400000, // 24 hours
  week: 604800000, // 7 days
  month: 2678400000, // 31 days
};

describe('max frequency condition delegate', function() {
  var mockVisitorTracking;
  var mockEvent;
  var conditionDelegate;

  beforeEach(function() {
    window.localStorage.clear();

    mockVisitorTracking = {};

    var conditionDelegateInjector = require('inject-loader!../maxFrequency');
    conditionDelegate = conditionDelegateInjector({
      '../helpers/visitorTracking': mockVisitorTracking
    });

    mockEvent = {
      $rule: {
        id: 'RL123'
      }
    };
  });

  afterAll(function() {
    window.localStorage.clear();
  });

  describe('page view unit', function() {
    it('returns true if count has been met', function() {
      mockVisitorTracking.getLifetimePageViewCount = function() {
        return 5;
      };

      window.localStorage.setItem('com.adobe.reactor.core.maxFrequency.RL123.pageView', '3');

      var result = conditionDelegate({
        unit: 'pageView',
        count: 2
      }, mockEvent);

      expect(window.localStorage.getItem('com.adobe.reactor.core.maxFrequency.RL123.pageView'))
        .toBe('5');
      expect(result).toBe(true);
    });

    it('returns false if count has not been met', function() {
      mockVisitorTracking.getLifetimePageViewCount = function() {
        return 5;
      };

      window.localStorage.setItem('com.adobe.reactor.core.maxFrequency.RL123.pageView', '3');

      var result = conditionDelegate({
        unit: 'pageView',
        count: 3
      }, mockEvent);

      expect(window.localStorage.getItem('com.adobe.reactor.core.maxFrequency.RL123.pageView'))
        .toBe('3');
      expect(result).toBe(false);
    });
  });

  describe('session unit', function() {
    it('returns true if count has been met', function() {
      mockVisitorTracking.getSessionCount = function() {
        return 5;
      };

      window.localStorage.setItem('com.adobe.reactor.core.maxFrequency.RL123.session', '3');

      var result = conditionDelegate({
        unit: 'session',
        count: 2
      }, mockEvent);

      expect(window.localStorage.getItem('com.adobe.reactor.core.maxFrequency.RL123.session'))
        .toBe('5');
      expect(result).toBe(true);
    });

    it('returns false if count has not been met', function() {
      mockVisitorTracking.getSessionCount = function() {
        return 5;
      };

      window.localStorage.setItem('com.adobe.reactor.core.maxFrequency.RL123.session', '3');

      var result = conditionDelegate({
        unit: 'session',
        count: 3
      }, mockEvent);

      expect(window.localStorage.getItem('com.adobe.reactor.core.maxFrequency.RL123.session'))
        .toBe('3');
      expect(result).toBe(false);
    });
  });

  describe('visitor unit', function() {
    it('returns true if visitor has not been seen', function() {
      var result = conditionDelegate({
        unit: 'visitor'
      }, mockEvent);

      expect(window.localStorage.getItem('com.adobe.reactor.core.maxFrequency.RL123.visitor'))
        .toBe('true');
      expect(result).toBe(true);
    });

    it('returns false if visitor has been seen', function() {
      window.localStorage.setItem('com.adobe.reactor.core.maxFrequency.RL123.visitor', 'true');

      var result = conditionDelegate({
        unit: 'visitor'
      }, mockEvent);

      expect(window.localStorage.getItem('com.adobe.reactor.core.maxFrequency.RL123.visitor'))
        .toBe('true');
      expect(result).toBe(false);
    });
  });

  [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month'
  ].forEach(function(unit) {
    describe(unit + ' unit', function() {
      beforeEach(function() {
        jasmine.clock().install();
      });

      afterEach(function() {
        jasmine.clock().uninstall();
      });

      it('returns true if count has been met', function() {
        jasmine.clock().mockDate(new Date(5 * millisByUnit[unit]));

        window.localStorage.setItem('com.adobe.reactor.core.maxFrequency.RL123.' + unit,
          String(3 * millisByUnit[unit]));

        var result = conditionDelegate({
          unit: unit,
          count: 2
        }, mockEvent);

        expect(window.localStorage.getItem('com.adobe.reactor.core.maxFrequency.RL123.' + unit))
          .toBe(String(5 * millisByUnit[unit]));
        expect(result).toBe(true);
      });

      it('returns false if count has not been met', function() {
        jasmine.clock().mockDate(new Date(5 * millisByUnit[unit]));

        window.localStorage.setItem('com.adobe.reactor.core.maxFrequency.RL123.' + unit,
          String(3 * millisByUnit[unit]));

        var result = conditionDelegate({
          unit: unit,
          count: 3
        }, mockEvent);

        expect(window.localStorage.getItem('com.adobe.reactor.core.maxFrequency.RL123.' + unit))
          .toBe(String(3 * millisByUnit[unit]));
        expect(result).toBe(false);
      });
    });
  });
});

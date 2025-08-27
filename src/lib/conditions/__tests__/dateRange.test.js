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

var conditionDelegate = require('../dateRange');

describe('date range condition delegate', function () {
  it('returns true when date is after start date', function () {
    var start = new Date();
    start.setHours(start.getHours() - 1);
    var settings = { start: start.toISOString() };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when date is before start date', function () {
    var start = new Date();
    start.setHours(start.getHours() + 1);
    var settings = { start: start.toISOString() };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when date is before end date', function () {
    var end = new Date();
    end.setHours(end.getHours() + 1);
    var settings = { end: end.toISOString() };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when date is after end date', function () {
    var end = new Date();
    end.setHours(end.getHours() - 1);
    var settings = { end: end.toISOString() };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when date is after start date and before end date', function () {
    var start = new Date();
    start.setHours(start.getHours() - 1);
    var end = new Date();
    end.setHours(end.getHours() + 1);
    var settings = { start: start.toISOString(), end: end.toISOString() };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when date is before start date and end date', function () {
    var start = new Date();
    start.setHours(start.getHours() + 1);
    var end = new Date();
    end.setHours(end.getHours() + 2);
    var settings = { start: start.toISOString(), end: end.toISOString() };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns false when date is after start date and end date', function () {
    var start = new Date();
    start.setHours(start.getHours() - 2);
    var end = new Date();
    end.setHours(end.getHours() - 1);
    var settings = { start: start.toISOString(), end: end.toISOString() };
    expect(conditionDelegate(settings)).toBe(false);
  });
});

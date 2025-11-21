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

import { injectVisitorBehavior } from '../visitorBehavior.js';

const mockVisitorTracking = {
  getLandingPage: function () {
    return 'http://landingpage.com/test.html';
  },
  getTrafficSource: function () {
    return 'http://trafficsource.com';
  },
  getMinutesOnSite: function () {
    return 4;
  },
  getSessionCount: function () {
    return 2;
  },
  getSessionPageViewCount: function () {
    return 11;
  },
  getLifetimePageViewCount: function () {
    return 34;
  },
  getIsNewVisitor: function () {
    return true;
  }
};

const dataElementDelegate = injectVisitorBehavior({
  visitorTracking: mockVisitorTracking
});

describe('visitor behavior data element delegate', function () {
  it('returns landing page', function () {
    const settings = {
      attribute: 'landingPage'
    };

    expect(dataElementDelegate(settings)).toBe(
      'http://landingpage.com/test.html'
    );
  });

  it('returns traffic source', function () {
    const settings = {
      attribute: 'trafficSource'
    };

    expect(dataElementDelegate(settings)).toBe('http://trafficsource.com');
  });

  it('returns minutes on site', function () {
    const settings = {
      attribute: 'minutesOnSite'
    };

    expect(dataElementDelegate(settings)).toBe(4);
  });

  it('returns session count', function () {
    const settings = {
      attribute: 'sessionCount'
    };

    expect(dataElementDelegate(settings)).toBe(2);
  });

  it('returns session page view count', function () {
    const settings = {
      attribute: 'sessionPageViewCount'
    };

    expect(dataElementDelegate(settings)).toBe(11);
  });

  it('returns lifetime page view count', function () {
    const settings = {
      attribute: 'lifetimePageViewCount'
    };

    expect(dataElementDelegate(settings)).toBe(34);
  });

  it('returns whether visitor is new', function () {
    const settings = {
      attribute: 'isNewVisitor'
    };

    expect(dataElementDelegate(settings)).toBe(true);
  });
});

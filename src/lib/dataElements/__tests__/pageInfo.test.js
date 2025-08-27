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

import createPageInfo from '../pageInfo.js';

describe('page info data element delegate', function () {
  let dataElementDelegate;

  beforeAll(function () {
    const mockDocument = {
      location: {
        href: 'http://www.adobe.com/creativecloud/photography.html?promoid=NQCJRBTZ&mv=other',
        hostname: 'www.adobe.com',
        pathname: '/creativecloud/photography.html',
        protocol: 'http:'
      },
      referrer: 'http://www.google.com/',
      title:
        'Adobe Creative Cloud Photography plan | Professional photo editing software'
    };
    dataElementDelegate = createPageInfo(mockDocument);
  });

  it('returns the URL', function () {
    const settings = { attribute: 'url' };
    expect(dataElementDelegate(settings)).toBe(
      'http://www.adobe.com/creativecloud/photography.html?promoid=NQCJRBTZ&mv=other'
    );
  });

  it('returns the hostname', function () {
    const settings = { attribute: 'hostname' };
    expect(dataElementDelegate(settings)).toBe('www.adobe.com');
  });

  it('returns the pathname', function () {
    const settings = { attribute: 'pathname' };
    expect(dataElementDelegate(settings)).toBe(
      '/creativecloud/photography.html'
    );
  });

  it('returns the protocol', function () {
    const settings = { attribute: 'protocol' };
    expect(dataElementDelegate(settings)).toBe('http:');
  });

  it('returns the referrer', function () {
    const settings = { attribute: 'referrer' };
    expect(dataElementDelegate(settings)).toBe('http://www.google.com/');
  });

  it('returns the title', function () {
    const settings = { attribute: 'title' };
    expect(dataElementDelegate(settings)).toBe(
      'Adobe Creative Cloud Photography plan | Professional photo editing software'
    );
  });
});

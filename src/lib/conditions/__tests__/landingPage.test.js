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

import { injectLandingPage } from '../landingPage.js';
import textMatch from '../../helpers/textMatch.js';

const conditionDelegate = injectLandingPage({
  visitorTracking: {
    getLandingPage: function () {
      return 'http://landingpage.com/test.html';
    }
  },
  textMatch
});

describe('landing page condition delegate', function () {
  describe('legacy behavior', function () {
    it('returns true when the landing page matches a string', function () {
      const settings = {
        page: 'http://landingpage.com/test.html',
        pageIsRegex: false
      };
      expect(conditionDelegate(settings)).toBe(true);
    });

    it('returns false when the landing page does not match a string', function () {
      const settings = {
        page: 'http://foo.com/bar.html',
        pageIsRegex: false
      };
      expect(conditionDelegate(settings)).toBe(false);
    });

    it('returns true when the landing page matches a regex', function () {
      const settings = {
        page: 'Landingpage\\.com\\/t.st',
        pageIsRegex: true
      };
      expect(conditionDelegate(settings)).toBe(true);
    });

    it('returns false when the landing page does not match a regex', function () {
      const settings = {
        page: 'f.o',
        pageIsRegex: true
      };
      expect(conditionDelegate(settings)).toBe(false);
    });
  });

  it('it returns false if the landing page value list is empty', function () {
    const settings = {
      landingPages: []
    };
    expect(conditionDelegate(settings)).toBe(false);
  });

  describe('lists of varying size', function () {
    describe('as strings', function () {
      describe('returns false when', function () {
        it('the list is of size 1', function () {
          const settings = {
            landingPages: [{ value: 'http://foo.com/bar.html' }]
          };
          expect(conditionDelegate(settings)).toBe(false);
        });

        it('the list has many items', function () {
          const settings = {
            landingPages: [
              { value: 'bizzy' },
              { value: 'bazzy' },
              { value: 'buzzy' }
            ]
          };
          expect(conditionDelegate(settings)).toBe(false);
        });
      });

      describe('returns true when', function () {
        it('the list is of size 1', function () {
          const settings = {
            landingPages: [{ value: 'http://landingpage.com/test.html' }]
          };
          expect(conditionDelegate(settings)).toBe(true);
        });

        it('the match is at the front of a many item list', function () {
          const settings = {
            landingPages: [
              { value: 'http://landingpage.com/test.html' },
              { value: 'bazzy' },
              { value: 'buzzy' }
            ]
          };
          expect(conditionDelegate(settings)).toBe(true);
        });

        it('the match is in the middle of a many item list', function () {
          const settings = {
            landingPages: [
              { value: 'bizzy' },
              { value: 'http://landingpage.com/test.html' },
              { value: 'buzzy' }
            ]
          };
          expect(conditionDelegate(settings)).toBe(true);
        });

        it('the match is at the end of a many item list', function () {
          const settings = {
            landingPages: [
              { value: 'bizzy' },
              { value: 'bazzy' },
              { value: 'http://landingpage.com/test.html' }
            ]
          };
          expect(conditionDelegate(settings)).toBe(true);
        });
      });
    });

    describe('as RegularExpressions', function () {
      describe('returns false when', function () {
        it('the list is of size 1', function () {
          const settings = {
            landingPages: [{ value: 'g.o', pageIsRegex: true }]
          };
          expect(conditionDelegate(settings)).toBe(false);
        });

        it('the list has many items', function () {
          const settings = {
            landingPages: [
              { value: 'a.b', pageIsRegex: true },
              { value: 'c.d', pageIsRegex: true },
              { value: 'e.f', pageIsRegex: true }
            ]
          };
          expect(conditionDelegate(settings)).toBe(false);
        });
      });

      describe('returns true when', function () {
        it('the list is of size 1', function () {
          const settings = {
            landingPages: [
              { value: 'Landingpage\\.com\\/t.st', pageIsRegex: true }
            ]
          };
          expect(conditionDelegate(settings)).toBe(true);
        });

        it('the match is at the front of a many item list', function () {
          const settings = {
            landingPages: [
              { value: 'Landingpage\\.com\\/t.st', pageIsRegex: true },
              { value: 'bazzy', pageIsRegex: false },
              { value: 'buzzy', pageIsRegex: true }
            ]
          };
          expect(conditionDelegate(settings)).toBe(true);
        });

        it('the match is in the middle of a many item list', function () {
          const settings = {
            landingPages: [
              { value: 'bizzy', pageIsRegex: false },
              { value: 'Landingpage\\.com\\/t.st', pageIsRegex: true },
              { value: 'buzzy', pageIsRegex: true }
            ]
          };
          expect(conditionDelegate(settings)).toBe(true);
        });

        it('the match is at the end of a many item list', function () {
          const settings = {
            landingPages: [
              { value: 'bizzy', pageIsRegex: false },
              { value: 'bazzy', pageIsRegex: true },
              { value: 'Landingpage\\.com\\/t.st', pageIsRegex: true }
            ]
          };
          expect(conditionDelegate(settings)).toBe(true);
        });
      });
    });
  });
});

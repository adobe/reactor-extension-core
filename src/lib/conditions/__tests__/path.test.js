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

var mockDocument = {
  location: {
    pathname: '/foo/bar.html',
    search: '?mmm=bacon'
  }
};

var conditionDelegateInjector = require('inject-loader!../path');
var conditionDelegate = conditionDelegateInjector({
  '@adobe/reactor-document': mockDocument
});

describe('path condition delegate', function () {
  it('returns true when the path matches an acceptable string', function () {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: '/foo/bar.html'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the path does not match an acceptable string', function () {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: 'hotdogs.html'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the path matches an acceptable regex', function () {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: '\\/Foo\\/bar.*',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the path does not match an acceptable regex', function () {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: '/index.*',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });
});

/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

'use strict';

var deviceAttributesDelegateInjector = require('inject-loader!../deviceAttributes');

describe('visitor attributes data element delegate', function () {
  it('returns the window size', function () {
    var deviceAttributesDelegate = deviceAttributesDelegateInjector({
      '@adobe/reactor-window': {
        screen: { width: 100, height: 200 }
      }
    });

    expect(deviceAttributesDelegate({ attribute: 'screenSize' })).toBe(
      '100x200'
    );
  });

  it('returns the window size', function () {
    var deviceAttributesDelegate = deviceAttributesDelegateInjector({
      '@adobe/reactor-document': {
        documentElement: { clientWidth: 150, clientHeight: 250 }
      }
    });

    expect(deviceAttributesDelegate({ attribute: 'windowSize' })).toBe(
      '150x250'
    );
  });
});

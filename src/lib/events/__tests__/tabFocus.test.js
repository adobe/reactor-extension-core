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

const createTabFocusDelegate = require('../tabFocus');
var visibilityApi = require('../helpers/visibilityApi');
var visibilityApiInstance = visibilityApi();
var visibilityChangeListener;

var mockDocument = {
  location: 'somelocation',
  addEventListener: function (event, listener) {
    if (event && event === visibilityApiInstance.visibilityChangeEventType) {
      visibilityChangeListener = listener;
    }
  }
};

var delegate = createTabFocusDelegate(mockDocument);

var isIE = function () {
  var myNav = navigator.userAgent.toLowerCase();
  return myNav.indexOf('msie') !== -1
    ? parseInt(myNav.split('msie')[1])
    : false;
};

describe('tab focus event delegate', function () {
  if (!isIE() || isIE() > 9) {
    it('triggers rule when the tabfocus event occurs', function () {
      var trigger = jasmine.createSpy();

      delegate({}, trigger);

      expect(trigger.calls.count()).toBe(0);

      mockDocument[visibilityApiInstance.hiddenProperty] = false;
      visibilityChangeListener.call(location);

      expect(trigger.calls.count()).toBe(1);
      var call = trigger.calls.mostRecent();
      expect(call.args.length).toBe(0);
    });
  }
});

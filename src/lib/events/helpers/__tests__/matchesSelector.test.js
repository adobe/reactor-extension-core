/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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

describe('matchesSelector', function() {
  var matchesSelector = require('../matchesSelector');

  it('returns true if the selector matches', function() {
    var div = document.createElement('div');
    div.className = 'foo';

    // IE9 requires the element to be added to the document.
    document.body.appendChild(div);
    expect(matchesSelector(div, '.foo')).toBe(true);
    document.body.removeChild(div);
  });

  it('returns false if the selector does not match', function() {
    var div = document.createElement('div');
    div.className = 'goo';
    // IE9 requires the element to be added to the document.
    document.body.appendChild(div);
    expect(matchesSelector(div, '.foo')).toBe(false);
    document.body.removeChild(div);
  });

  it('returns false for document', function() {
    expect(matchesSelector(document, 'document')).toBe(false);
  });

  it('returns false for window', function() {
    expect(matchesSelector(window, 'window')).toBe(false);
  });

  it('logs a warning when selector matching fails', function() {
    var logger = jasmine.createSpyObj('logger', ['warn']);
    var matchesSelectorInjector = require('inject!../matchesSelector');
    var matchesSelector = matchesSelectorInjector({
      '@turbine/logger': logger
    });

    matchesSelector(document.body, 'somewrong#!@$%selector');
    expect(logger.warn).toHaveBeenCalled();
  });
});

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

var dataElementDelegate = require('../domAttribute');

describe('dom attribute data element delegate', function() {
  var testElement;

  beforeAll(function() {
    testElement = document.createElement('div');
    testElement.id = 'domDataElement';
    testElement.innerHTML = 'Foo Content';
    testElement.setAttribute('data-cake', 'delish');
    document.body.appendChild(testElement);
  });

  afterAll(function() {
    document.body.removeChild(testElement);
  });

  it('returns the text value of the first matching element', function() {
    var settings = {
      elementSelector: '#domDataElement',
      elementProperty: 'text'
    };

    expect(dataElementDelegate(settings)).toBe('Foo Content');
  });

  it('returns an attribute of the first matching element', function() {
    var settings = {
      elementSelector: '#domDataElement',
      elementProperty: 'data-cake'
    };

    expect(dataElementDelegate(settings)).toBe('delish');
  });

  it('returns undefined if element doesn\'t exist', function() {
    var settings = {
      elementSelector: '#doesntExist',
      elementProperty: 'data-cake'
    };

    expect(dataElementDelegate(settings)).toBe(undefined);
  });

  it('returns null if attribute doesn\'t exist', function() {
    var settings = {
      elementSelector: '#domDataElement',
      elementProperty: 'data-doesntexist'
    };

    expect(dataElementDelegate(settings)).toBe(null);
  });
});

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

var dataElementDelegate = require('../dom');

describe('dom data element delegate', function() {
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

  it('should return the text value of the first matching element', function() {
    var settings = {
      elementSelector: '#domDataElement',
      elementProperty: 'text'
    };

    expect(dataElementDelegate(settings)).toBe('Foo Content');
  });

  it('should return an attribute of the first matching element', function() {
    var settings = {
      elementSelector: '#domDataElement',
      elementProperty: 'data-cake'
    };

    expect(dataElementDelegate(settings)).toBe('delish');
  });
});

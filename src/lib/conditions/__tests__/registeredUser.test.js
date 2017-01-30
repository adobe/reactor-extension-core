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

var conditionDelegateInjector = require('inject!../registeredUser');

describe('registered user condition delegate', function() {
  it('returns the data element value', function() {
    var dataElementValue;

    var getDataElementValue = jasmine.createSpy().and.callFake(function() {
      return dataElementValue;
    });

    var conditionDelegate = conditionDelegateInjector({
      '@turbine/get-data-element-value': getDataElementValue
    });

    var settings = {
      dataElement: 'foo'
    };

    dataElementValue = true;
    expect(conditionDelegate(settings)).toBe(true);

    dataElementValue = false;
    expect(conditionDelegate(settings)).toBe(false);

    dataElementValue = undefined;
    expect(conditionDelegate(settings)).toBe(false);

    expect(getDataElementValue).toHaveBeenCalledWith('foo', true);
  });
});

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

var getQueryParamSpy = jasmine.createSpy().and.returnValue('bar');
var dataElementDelegate = require('inject!../queryParameter')({
  '@turbine/get-query-param': getQueryParamSpy
});

describe('queryParam data element delegate', function() {
  it('should return a query parameter value', function() {
    var settings = {
      name: 'foo',
      caseInsensitive: true
    };

    var value = dataElementDelegate(settings);

    expect(value).toBe('bar');
    expect(getQueryParamSpy.calls.argsFor(0)).toEqual(['foo', true]);
  });
});

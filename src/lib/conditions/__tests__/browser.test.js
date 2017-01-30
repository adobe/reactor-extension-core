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

var mockClientInfo = {
  browser: 'Foo'
};

var conditionDelegateInjector = require('inject!../browser');
var conditionDelegate = conditionDelegateInjector({
  '@turbine/client-info': mockClientInfo
});

var getSettings = function(browsers) {
  return {
    browsers: browsers
  };
};

describe('browser condition delegate', function() {
  it('returns true when the current browser matches one of the selected browsers', function() {
    var settings = getSettings(['Shoe', 'Goo', 'Foo', 'Moo']);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the current browser does not match any of the ' +
      'selected browsers', function() {
    var settings = getSettings(['Shoe', 'Goo', 'Boo', 'Moo']);
    expect(conditionDelegate(settings)).toBe(false);
  });
});

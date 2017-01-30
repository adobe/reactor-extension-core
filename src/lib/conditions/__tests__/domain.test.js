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

var mockDocument = {
  location: {
    hostname: 'foo.adobe.com'
  }
};

var conditionDelegateInjector = require('inject!../domain');
var conditionDelegate = conditionDelegateInjector({
  '@turbine/document': mockDocument
});

var getSettings = function(domains) {
  return {
    domains: domains
  };
};

describe('domain condition delegate', function() {
  it('returns true when the domain matches', function() {
    var settings = getSettings(['example\.com$', 'Adobe\.com$']);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the domain does not match', function() {
    var settings = getSettings(['example\.com$', 'yahoo\.com$']);
    expect(conditionDelegate(settings)).toBe(false);
  });
});

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

var enableWeakMapDefaultValue = require('../enableWeakMapDefaultValue');
var WeakMap = require('@adobe/composer-turbine/lib/require')('@turbine/weak-map');

describe('enableWeakMapDefaultValue', function() {
  it('stores and returns the provided default value', function() {
    var map = new WeakMap();
    enableWeakMapDefaultValue(map, function() { return []; });

    var key = {};

    var value1 = map.get(key);

    expect(value1).toEqual([]);

    value1.push('foo');

    var value2 = map.get(key);

    expect(value2).toBe(value1);
    expect(value2).toEqual(['foo']);
  });
});

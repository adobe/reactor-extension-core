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

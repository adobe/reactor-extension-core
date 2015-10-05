'use strict';

// This emulates propertes that a client's website might add to the object prototype. This is to
// test that we are properly excluding them while looping over object properties.
Object.prototype.inheritedProperty1 = null;
Object.prototype.inheritedProperty2 = 'foo';
Object.prototype.inheritedProperty3 = 123;
Object.prototype.inheritedProperty4 = function() {};

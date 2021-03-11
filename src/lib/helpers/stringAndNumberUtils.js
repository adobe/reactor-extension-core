'use strict';

var isNumber = function (value) {
  return typeof value === 'number' && isFinite(value); // isFinite weeds out NaNs.
};

var isString = function (value) {
  return typeof value === 'string' || value instanceof String;
};

var castToStringIfNumber = function (value) {
  return isNumber(value) ? String(value) : value;
};

var castToNumberIfString = function (value) {
  return isString(value) ? Number(value) : value;
};

module.exports = {
  isNumber: isNumber,
  isString: isString,
  castToStringIfNumber: castToStringIfNumber,
  castToNumberIfString: castToNumberIfString
};

const isNumber = function (value) {
  return typeof value === 'number' && isFinite(value); // isFinite weeds out NaNs.
};

const isString = function (value) {
  return typeof value === 'string' || value instanceof String;
};

const castToStringIfNumber = function (value) {
  return isNumber(value) ? String(value) : value;
};

const castToNumberIfString = function (value) {
  return isString(value) ? Number(value) : value;
};

export { isNumber, isString, castToStringIfNumber, castToNumberIfString };

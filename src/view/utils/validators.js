export const isNumber = value => {
  return !isNaN(value) && (typeof value !== 'string' || value.trim().length > 0);
};

export const isPositiveNumber = (value, includeZero) => {
  var lowerBound = includeZero ? 0 : 1;
  return isNumber(value) && Number(value) >= lowerBound;
};

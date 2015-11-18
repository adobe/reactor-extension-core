/**
 * Determines if the value is a regular expression. If it is, it will return the regular expression
 * pattern from the regular expression. In other words, if the value is a regular expression
 * of /abc/i, this will return "abc". If the value is not a regular expression, the value
 * be returned unchanged.
 * @param {*} value A value which may or may not be a regular expression.
 * @returns {String}
 */
module.exports = function(value) {
  if (value instanceof RegExp) {
    var match = value.toString().match(new RegExp('^/(.*?)/[gimy]*$'));
    return match ? match[1] : '';
  } else {
    return value;
  }
};

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
    var pattern = match ? match[1] : '';

    // The ECMA standard specifies that regular expressions may not be empty and states that the
    // pattern in these cases should be (?:). In other words, new RegExp().toString() === '/(?:)/'
    // Typically we don't want to be dealing with what essentially amounts to a placeholder
    // pattern so we will return an empty string instead.
    // Bottom of the section: http://ecma262-5.com/ELS5_HTML.htm#Section_7.8.5
    if (pattern === '(?:)') {
      pattern = '';
    }

    return pattern;
  } else {
    return value;
  }
};

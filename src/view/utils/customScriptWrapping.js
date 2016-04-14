import escapeStringRegexp from 'escape-string-regexp';

const getPrefix = paramNames => {
  return 'function(' + paramNames.join(', ') + ') { ';
};

const getSuffix = () => ' }';

export default {
  /**
   * Wraps a string in a function block and optionally includes parameter names.
   * @param {string} str
   * @param {string[]} [paramNames]
   * @returns string
   */
  wrap: (str, paramNames = []) => {
    return getPrefix(paramNames) + str + getSuffix();
  },
  /**
   * Unwraps the content from a function block.
   * @param {string} str
   * @param {string[]} [paramNames]
   * @returns string
   */
  unwrap: (str, paramNames = []) => {
    const regex = new RegExp(
      escapeStringRegexp(getPrefix(paramNames)) +
      '(.*?)' +
      escapeStringRegexp(getSuffix()));
    const matches = str.match(regex);
    return matches ? matches[1] : null;
  }
}

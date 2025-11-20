/**
 * Rollup plugin to inject global variables (turbine, require) into the bundle
 * These are provided by the Turbine runtime and mocked in tests via mockDelegateWrapper
 */
export default function injectGlobals() {
  return {
    name: 'inject-globals',
    transform(code, id) {
      // Skip processing node_modules and test files
      if (id.includes('node_modules') || id.includes('.test.js') || id.includes('__tests__')) {
        return null;
      }

      let transformedCode = code;

      // Replace turbine.something with globalThis.turbine.something
      // This handles direct property access
      transformedCode = transformedCode.replace(
        /\bturbine\./g,
        'globalThis.turbine.'
      );

      // Replace standalone turbine that's NOT part of another identifier
      // Use word boundaries but be more careful with the regex
      transformedCode = transformedCode.replace(
        /(^|[^\w.])turbine\b/g,
        '$1globalThis.turbine'
      );

      // Replace require( with globalThis.require(
      // Use word boundaries but be more careful
      transformedCode = transformedCode.replace(
        /(^|[^\w.])require\s*\(/g,
        '$1globalThis.require('
      );

      // Note: We can't validate syntax here because the code still contains
      // ES6 import/export statements that haven't been bundled yet.
      // Rollup will catch any syntax errors during bundling.

      return {
        code: transformedCode,
        map: null
      };
    }
  };
}

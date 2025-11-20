/**
 * Rollup plugin to inject global variables (turbine, require) into the bundle
 * These are provided by the Turbine runtime and mocked in tests via mockDelegateWrapper
 */
export default function injectGlobals() {
  return {
    name: 'inject-globals',
    transform(code, id) {
      // Skip processing node_modules
      if (id.includes('node_modules')) {
        return null;
      }

      // Replace bare `turbine` identifier with globalThis.turbine
      // But be careful not to replace it in strings or comments
      let transformedCode = code;

      // Replace turbine references (but not in import/export statements or strings)
      transformedCode = transformedCode.replace(
        /\bturbine\b(?!['"`;])/g,
        'globalThis.turbine'
      );

      // Replace require() calls with globalThis.require()
      // Match require('...') or require("...")
      transformedCode = transformedCode.replace(
        /\brequire\s*\(/g,
        'globalThis.require('
      );

      return {
        code: transformedCode,
        map: null
      };
    }
  };
}

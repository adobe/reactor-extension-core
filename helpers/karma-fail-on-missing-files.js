// Custom Karma plugin to fail when file patterns don't match any files
function createFailOnMissingFilesPlugin(logger) {
  const log = logger.create('fail-on-missing-files');

  return {
    'file_list_modified': function(files) {
      // This is called after Karma processes the file patterns
      // Check if any warnings were logged about missing patterns
    }
  };
}

createFailOnMissingFilesPlugin.$inject = ['logger'];

// Monkey-patch console.warn to catch Karma's file pattern warnings
const originalWarn = console.warn;
let hasFilePatternWarnings = false;

console.warn = function(...args) {
  const message = args.join(' ');
  if (message.includes('does not match any file')) {
    hasFilePatternWarnings = true;
    originalWarn.apply(console, args);
    throw new Error(`File pattern warning detected: ${message}`);
  }
  originalWarn.apply(console, args);
};

export default {
  'framework:fail-on-missing-files': ['factory', createFailOnMissingFilesPlugin]
};


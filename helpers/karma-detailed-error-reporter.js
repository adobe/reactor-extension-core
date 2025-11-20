/**
 * Karma plugin to provide detailed error reporting
 * Helps identify which file is causing syntax errors
 */

function createDetailedErrorReporter(baseReporterDecorator, formatError) {
  baseReporterDecorator(this);

  this.onBrowserError = function (browser, error) {
    console.error('\n=== BROWSER ERROR ===');
    console.error('Browser:', browser.name);
    console.error('Error message:', typeof error === 'string' ? error : error.message || error);
    
    // Try to extract more details from the error object
    if (typeof error === 'object' && error !== null) {
      console.error('Error type:', error.name || error.type || 'Unknown');
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
    
    console.error('Stack:', error.stack || 'No stack trace');
    console.error('===================\n');
  };

  this.onSpecComplete = function (browser, result) {
    // Log detailed information when a spec completes with errors
    if (!result.success && result.log && result.log.length > 0) {
      console.error('\n=== SPEC FAILED ===');
      console.error('Browser:', browser.name);
      console.error('Suite:', result.suite.join(' > '));
      console.error('Description:', result.description);
      console.error('Logs:');
      result.log.forEach(function (log) {
        console.error('  -', log);
      });
      console.error('===================\n');
    }
  };

  this.onRunComplete = function (browsers, results) {
    if (results.error) {
      console.error('\n=== RUN COMPLETE WITH ERRORS ===');
      console.error('Errors:', JSON.stringify(results, null, 2));
      console.error('===============================\n');
    }
  };

  this.onBrowserLog = function (browser, log, type) {
    // Log ALL browser logs during errors to help debug
    if (type === 'error') {
      console.error('\n=== BROWSER LOG ERROR ===');
      console.error('Browser:', browser.name);
      console.error('Type:', type);
      console.error('Log:', JSON.stringify(log, null, 2));
      console.error('========================\n');
    }
  };
}

createDetailedErrorReporter.$inject = ['baseReporterDecorator', 'formatError'];

export default {
  'reporter:detailed-error': ['type', createDetailedErrorReporter]
};

/* eslint-env es6 */
import path from 'path';
import karmaCoverage from 'karma-coverage';
import karmaJasmine from 'karma-jasmine';
import karmaJasmineMatchers from 'karma-jasmine-matchers';
import karmaChromeLauncher from 'karma-chrome-launcher';
import karmaRollupPreprocessor from 'karma-rollup-preprocessor';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupIstanbul from 'rollup-plugin-istanbul';
import replace from '@rollup/plugin-replace';

export default (config) => {
  config.set({
    hostname: '0.0.0.0',
    basePath: '',
    frameworks: ['jasmine', 'jasmine-matchers'],
    failOnEmptyTestSuite: true, // Fail if no tests are found
    failOnSkippedTests: false,
    failOnFailingTestSuite: true,
    // files: [{ pattern: './src/**/*.js', type: 'module' }],
    // preprocessors: {
    //   './src/**/*.js': ['rollup']
    // },
    files: [
      'helpers/mockDelegateWrapper.js',
      {
        pattern:
          'src/lib/actions/helpers/decorators/__tests__/decorateHtmlCode.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/conditions/__tests__/operatingSystem.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/conditions/__tests__/domain.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/conditions/__tests__/pageViews.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/actions/helpers/decorators/__tests__/decorateNonGlobalJavaScriptCode.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/conditions/__tests__/queryStringParameter.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/helpers/__tests__/getNamespacedStorage.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/actions/helpers/__tests__/getSourceByUrl.test.js',
        type: 'module'
      },
      {
        pattern:
          'src/lib/actions/helpers/decorators/__tests__/decorateGlobalJavaScriptCode.test.js',
        type: 'module'
      },
      {
        pattern:
          'src/lib/conditions/__tests__/trafficSource.test.js',
        type: 'module'
      },
      {
        pattern:
          'src/lib/conditions/__tests__/windowSize.test.js',
        type: 'module'
      },
      {
        pattern:
          'src/lib/conditions/__tests__/sessions.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/actions/helpers/__tests__/loadCodeSequentially.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/helpers/__tests__/visitorTracking.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/conditions/__tests__/subdomain.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/conditions/__tests__/newReturningVisitor.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/conditions/__tests__/deviceType.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/actions/helpers/__tests__/decorateCode.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/conditions/__tests__/maxFrequency.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/dataElements/__tests__/visitorBehavior.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/dataElements/__tests__/deviceAttributes.test.js',
        type: 'module'
      },{
        pattern: 'src/lib/dataElements/__tests__/runtimeEnvironment.test.js',
        type: 'module'
      },{
        pattern: 'src/lib/dataElements/__tests__/localStorage.test.js',
        type: 'module'
      },
      {
        pattern: 'src/lib/conditions/__tests__/path.test.js',
        type: 'module'
      },{
        pattern: 'src/lib/conditions/__tests__/pathAndQueryString.test.js',
        type: 'module'
      },{
        pattern: 'src/lib/conditions/__tests__/timeOnSite.test.js',
        type: 'module'
      },{
        pattern: 'src/lib/conditions/__tests__/screenResolution.test.js',
        type: 'module'
      },{
        pattern: 'src/lib/dataElements/__tests__/mergedObjects.test.js',
        type: 'module'
      },{
        pattern: 'src/lib/conditions/__tests__/browser.test.js',
        type: 'module'
      },
    ],
    preprocessors: {
      'src/lib/actions/helpers/decorators/__tests__/decorateHtmlCode.test.js': [
        'rollup'
      ],
      'src/lib/conditions/__tests__/operatingSystem.test.js': ['rollup'],
      'src/lib/conditions/__tests__/domain.test.js': ['rollup'],
      'src/lib/conditions/__tests__/pageViews.test.js': ['rollup'],
      'src/lib/actions/helpers/decorators/__tests__/decorateNonGlobalJavaScriptCode.test.js': ['rollup'],
      'src/lib/conditions/__tests__/queryStringParameter.test.js': ['rollup'],
      'src/lib/helpers/__tests__/getNamespacedStorage.test.js': ['rollup'],
      'src/lib/actions/helpers/__tests__/getSourceByUrl.test.js': ['rollup'],
      'src/lib/actions/helpers/decorators/__tests__/decorateGlobalJavaScriptCode.test.js': ['rollup'],
      'src/lib/conditions/__tests__/trafficSource.test.js': ['rollup'],
      'src/lib/conditions/__tests__/windowSize.test.js': ['rollup'],
      'src/lib/conditions/__tests__/sessions.test.js': ['rollup'],
      'src/lib/actions/helpers/__tests__/loadCodeSequentially.test.js': ['rollup'],
      'src/lib/helpers/__tests__/visitorTracking.test.js': ['rollup'],
      'src/lib/conditions/__tests__/subdomain.test.js': ['rollup'],
      'src/lib/conditions/__tests__/newReturningVisitor.test.js': ['rollup'],
      'src/lib/conditions/__tests__/deviceType.test.js': ['rollup'],
      'src/lib/actions/helpers/__tests__/decorateCode.test.js': ['rollup'],
      'src/lib/conditions/__tests__/maxFrequency.test.js': ['rollup'],
      'src/lib/dataElements/__tests__/visitorBehavior.test.js': ['rollup'],
      'src/lib/dataElements/__tests__/deviceAttributes.test.js': ['rollup'],
      'src/lib/dataElements/__tests__/runtimeEnvironment.test.js': ['rollup'],
      'src/lib/dataElements/__tests__/localStorage.test.js': ['rollup'],
      'src/lib/conditions/__tests__/path.test.js': ['rollup'],
      'src/lib/conditions/__tests__/pathAndQueryString.test.js': ['rollup'],
      'src/lib/conditions/__tests__/timeOnSite.test.js': ['rollup'],
      'src/lib/conditions/__tests__/screenResolution.test.js': ['rollup'],
      'src/lib/dataElements/__tests__/mergedObjects.test.js': ['rollup'],
      'src/lib/conditions/__tests__/browser.test.js': ['rollup'],
    },
    plugins: [
      karmaCoverage,
      karmaJasmine,
      karmaJasmineMatchers,
      karmaChromeLauncher,
      karmaRollupPreprocessor,
      nodeResolve,
      commonjs
    ],
    reporters: ['dots', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
        { type: 'text-summary' },
        { type: 'text' }
      ]
    },
    rollupPreprocessor: {
      output: {
        format: 'iife',
        sourcemap: 'inline'
      },
      onwarn: (warning, warn) => {
        // Fail loudly on unresolved imports or missing files
        if (warning.code === 'UNRESOLVED_IMPORT' || warning.code === 'MISSING_EXPORT') {
          throw new Error(warning.message);
        }
        // Log other warnings
        warn(warning);
      },
      plugins: [
        replace({
          preventAssignment: true,
          REACTOR_KARMA_CI_UNIT_TEST_MODE: JSON.stringify(true)
        }),
        nodeResolve({
          // Make node resolve throw on unresolved modules
          modulesOnly: false
        }),
        commonjs(),
        rollupIstanbul({
          exclude: ['**/*.test.js', '**/__tests__/**']
        })
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: 5,
    captureTimeout: 60000,
    browserDisconnectTimeout: 20000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,
    client: {
      captureConsole: true,
      jasmine: {
        // seed: 55788
      }
    }
  });
};

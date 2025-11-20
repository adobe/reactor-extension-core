/* eslint-env es6 */
import karmaCoverage from 'karma-coverage';
import karmaJasmine from 'karma-jasmine';
import karmaJasmineMatchers from 'karma-jasmine-matchers';
import karmaChromeLauncher from 'karma-chrome-launcher';
import karmaRollupPreprocessor from 'karma-rollup-preprocessor';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupIstanbul from 'rollup-plugin-istanbul';
import replace from '@rollup/plugin-replace';
import injectGlobals from './helpers/rollup-plugin-inject-globals.js';
import detailedErrorReporter from './helpers/karma-detailed-error-reporter.js';

export default (config) => {
  config.set({
    hostname: '0.0.0.0',
    basePath: '',
    frameworks: ['jasmine', 'jasmine-matchers'],
    failOnEmptyTestSuite: true, // Fail if no tests are found
    failOnSkippedTests: false,
    failOnFailingTestSuite: true,
    files: [
      {
        pattern: './helpers/mockDelegateWrapper.js',
        watched: false,
        type: 'module'
      },
      { pattern: './src/**/*.js', type: 'module' }
    ],
    preprocessors: {
      './helpers/setupTestEnv.js': ['rollup'],
      './helpers/mockDelegateWrapper.js': ['rollup'],
      './src/**/*.js': ['rollup']
    },
    plugins: [
      karmaCoverage,
      karmaJasmine,
      karmaJasmineMatchers,
      karmaChromeLauncher,
      karmaRollupPreprocessor,
      nodeResolve,
      commonjs,
      detailedErrorReporter
    ],
    reporters: ['dots', 'coverage', 'detailed-error'],
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
        sourcemap: 'inline',
        name: 'TestBundle' // Add a name to help identify issues
      },
      onwarn: (warning, warn) => {
        // Fail loudly on unresolved imports or missing files
        if (
          warning.code === 'UNRESOLVED_IMPORT' ||
          warning.code === 'MISSING_EXPORT'
        ) {
          console.error('\n=== ROLLUP WARNING ===');
          console.error('Code:', warning.code);
          console.error('Message:', warning.message);
          console.error('File:', warning.id);
          console.error('=====================\n');
          throw new Error(warning.message);
        }
        // Suppress IIFE export warnings for test bundles (tests don't export anything meaningful)
        if (warning.code === 'MISSING_NAME_OPTION_FOR_IIFE_EXPORT') {
          return;
        }
        if (warning.code === 'MIXED_EXPORTS') {
          return;
        }
        // Log other warnings with more detail
        if (warning.code === 'PARSE_ERROR') {
          console.error('\n=== ROLLUP PARSE ERROR ===');
          console.error('Message:', warning.message);
          console.error('File:', warning.id);
          console.error('Location:', warning.loc);
          console.error('Frame:', warning.frame);
          console.error('=========================\n');
        }
        // Log other warnings
        console.warn('Rollup warning:', warning.code, warning.message);
        warn(warning);
      },
      plugins: [
        injectGlobals(),
        nodeResolve({
          // Make node resolve throw on unresolved modules
          modulesOnly: false,
          browser: true,
          preferBuiltins: false
        }),
        commonjs({
          include: /node_modules/
        }),
        replace({
          preventAssignment: true,
          'REACTOR_KARMA_CI_UNIT_TEST_MODE': JSON.stringify(true),
          'process.env.SCALE_MEDIUM': 'true',
          'process.env.SCALE_LARGE': 'false',
          'process.env.THEME_LIGHT': 'false',
          'process.env.THEME_LIGHTEST': 'true',
          'process.env.THEME_DARK': 'false',
          'process.env.THEME_DARKEST': 'false',
          'process.browser': 'true'
        }),
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

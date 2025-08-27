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

export default (config) => {
  config.set({
    hostname: '0.0.0.0',
    basePath: '',
    frameworks: ['jasmine', 'jasmine-matchers'],
    files: [
      { pattern: 'src/lib/events/__tests__/customCode.test.js', type: 'module' }
    ],
    preprocessors: {
      'src/lib/events/__tests__/customCode.test.js': ['rollup']
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
        file: path.resolve('coverage/rollup/test-bundle.js'),
        format: 'iife',
        sourcemap: 'inline'
      },
      plugins: [
        nodeResolve(),
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
      jasmine: {
        // seed: 55788
      }
    }
  });
};

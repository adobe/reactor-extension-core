// karma.conf.mjs
import karmaJasmine from 'karma-jasmine';
import karmaJasmineMatchers from 'karma-jasmine-matchers';
import karmaChromeLauncher from 'karma-chrome-launcher';
import karmaRollupPreprocessor from 'karma-rollup-preprocessor';
import karmaCoverage from 'karma-coverage';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import styles from 'rollup-plugin-styles';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import path from 'path';
import injectGlobals from './helpers/rollup-plugin-inject-globals.js';
import babelTransformRuntime from '@babel/plugin-transform-runtime';
import { fileURLToPath } from 'url';
import polyfillNode from 'rollup-plugin-polyfill-node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (config) => {
  config.set({
    hostname: '0.0.0.0',
    basePath: '',
    frameworks: ['jasmine', 'jasmine-matchers'],
    failOnEmptyTestSuite: true,
    files: [
      // Use the generated index file (prebuilt testIndex.generated.js)
      { pattern: './testIndex.generated.js', type: 'module', watched: false }
    ],
    preprocessors: {
      './testIndex.generated.js': ['rollup'],
    },
    plugins: [
      karmaJasmine,
      karmaJasmineMatchers,
      karmaChromeLauncher,
      karmaRollupPreprocessor,
      karmaCoverage,
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
        format: 'iife',           // Browser-friendly bundle
        sourcemap: 'inline',      // Optional
        name: 'TestBundle',       // Global variable name
      },
      plugins: [
        injectGlobals(),
        alias({
          entries: [
            { find: '@test-helpers', replacement: path.resolve(__dirname, 'src/view/__tests__/helpers') }
          ]
        }),
        polyfillNode({
          include: ["**/*.js", "**/*.mjs"]
        }),
        nodeResolve({
          browser: true,
          extensions: ['.js', '.jsx', '.json']
        }),
        commonjs({
          include: /node_modules/
        }),
        json(),
        styles({
          mode: ['extract', null],
          include: ['**/*.css', '**/*.styl'],
          url: false
        }),
        babel({
          babelHelpers: 'runtime',
          exclude: 'node_modules/**',
          extensions: ['.js', '.jsx'],
          presets: [
            ['@babel/preset-env', { targets: '> 1%, last 2 versions, not dead' }],
            '@babel/preset-react'
          ],
          plugins: [
            [babelTransformRuntime, { useESModules: true }]
          ]
        }),
        replace({
          preventAssignment: true,
          'REACTOR_KARMA_CI_UNIT_TEST_MODE': JSON.stringify(true),
          'process.browser': 'true'
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
    client: {
      captureConsole: true,
    }
  });
};

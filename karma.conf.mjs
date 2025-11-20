import karmaJasmine from 'karma-jasmine';
import karmaChromeLauncher from 'karma-chrome-launcher';
import karmaCoverage from 'karma-coverage';
import karmaEsm from 'karma-esm';

export default config => {
  config.set({
    hostname: '0.0.0.0',
    basePath: '',

    frameworks: ['jasmine', 'esm'],

    files: [
      // Generated test index
      { pattern: 'testIndex.generated.js', type: 'module', watched: false },

      // Source files (tests will import them)
      { pattern: 'src/**/*.{js,jsx}', included: false, served: true, watched: true },

      // Helpers
      { pattern: 'helpers/**/*.js', included: false, served: true, watched: true }
    ],

    preprocessors: {
      'testIndex.generated.js': ['esm']
    },

    esm: {
      // Enable node module resolution
      nodeResolve: true,

      // Babel for JSX + modern JS
      babel: true,
      babelConfig: {
        presets: [
          ['@babel/preset-env', { targets: { chrome: '100' } }],
          '@babel/preset-react'
        ],
        plugins: [
          // Optional: JSX runtime if using automatic
          '@babel/plugin-transform-react-jsx'
        ]
      },

      // Aliases for your @test-helpers imports
      aliases: {
        '@test-helpers': './src/lib/__tests__/helpers'
      }
    },

    plugins: [
      karmaJasmine,
      karmaChromeLauncher,
      karmaCoverage,
      karmaEsm
    ],

    reporters: ['dots', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', file: 'lcov.info' },
        { type: 'text-summary' }
      ]
    },

    browsers: ['Chrome'],
    singleRun: true,
    concurrency: 5,

    client: {
      captureConsole: true
    }
  });
};

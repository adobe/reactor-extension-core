module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      { pattern: 'src/**/__tests__/**/objectPrototypeProperties.js', watched: true, included: true, served: true },
      { pattern: 'src/**/__tests__/**/loadTestpage.js', watched: true, included: true, served: true },
      { pattern: 'src/**/__tests__/**/testpage.js', watched: true, included: false, served: true },
      { pattern: 'src/**/__tests__/**/waitUntil.js', watched: true, included: true, served: true },
      { pattern: 'src/**/__tests__/**/*.test.js', watched: true, included: true, served: true },
      { pattern: 'node_modules/simulate/simulate.js', watched: false, included: true, served: true },
      { pattern: 'dist/**/*', watched: true, included: false, served: true },
      { pattern: 'src/**/__tests__/**/*!(.test)*', watched: true, included: false, served: true }
    ],

    exclude: [],

    preprocessors: {
      '**/__tests__/**/*.test.js': ['webpack']
    },

    webpackServer: {
      stats: true,
      debug: false,
      progress: true,
      quiet: false
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    // Browsers passed in via gulp.
    browsers: [
      'Chrome'
    ],

    captureTimeout: 60000,

    // Necessary because of https://github.com/webpack/karma-webpack/issues/44
    autoWatchBatchDelay: 1000,

    singleRun: false,

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-safari-launcher'),
      require('karma-webpack'),
      require('karma-coverage'),
      require('karma-ievms')
    ]
  });
};

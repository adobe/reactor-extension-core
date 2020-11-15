'use strict';

const DefinePlugin = require('webpack').DefinePlugin;
const SourceMapDevToolPlugin = require('webpack').SourceMapDevToolPlugin;
const path = require('path');
const packageDescriptor = require('./package.json');

let defaultBrowsers = ['Chrome'];
let startConnect = false;
const reporters = ['dots'];
let buildId;

if (process.env.CI) {
  buildId =
    'CI #' +
    process.env.GITHUB_RUN_NUMBER +
    ' (' +
    process.env.GITHUB_RUN_ID +
    ')';

  defaultBrowsers = [
    'SL_IE10',
    'SL_IE11',
    'SL_EDGE',
    'SL_CHROME',
    'SL_FIREFOX',
    'SL_ANDROID',
    'SL_SAFARI'
  ];
  reporters.push('saucelabs');
} else {
  startConnect = true;
}

if (process.env.SAUCE_USERNAME) {
  reporters.push('saucelabs');
}

const argv = require('yargs')
  .array('browsers')
  .default('browsers', defaultBrowsers)
  .default('singleRun', true)
  .default('testBasePath', '/src')
  .default('coverage', true).argv;

const rules = [
  {
    test: /\.jsx?$/,
    include: /src\/view/,
    loader: 'babel-loader',
    options: {
      presets: ['@babel/react', '@babel/env'],
      plugins: ['@babel/plugin-proposal-class-properties']
    }
  },
  {
    test: /\.js$/,
    include: /\.entries/,
    loader: 'babel-loader',
    options: {
      presets: ['@babel/env']
    }
  },
  {
    test: /\.styl/,
    include: /src\/view/,
    loader: 'style-loader!css-loader!stylus-loader'
  },
  {
    test: /\.css/,
    loaders: ['style-loader', 'css-loader']
  },
  {
    test: /\.(jpe?g|png|gif)$/,
    loader: 'file-loader'
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
  },
  {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader'
  }
];

if (argv.coverage) {
  rules.push({
    test: /\.jsx?$/,
    enforce: 'post',
    include: path.resolve('src/view'),
    exclude: new RegExp('__tests__'),
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true }
  });

  rules.push({
    test: /\.js$/,
    enforce: 'pre',
    include: path.resolve('src/lib'),
    exclude: new RegExp('__tests__'),
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true }
  });

  reporters.push('coverage-istanbul');
}

module.exports = config => {
  config.set({
    hostname: '0.0.0.0',

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'jasmine-matchers'],

    // list of files / patterns to load in the browser
    files: [
      {
        pattern: require.resolve('simulate'),
        watched: false,
        included: true,
        served: true
      },
      {
        pattern: path.join('helpers/*.js'),
        watched: true,
        included: true,
        served: true
      },
      {
        pattern: 'src/**/__tests__/**/*',
        // When this is false, any change to the files in __test__ without the .test.js extension
        // still triggers a re-run of tests. I don't know why but ultimately that's the result we want.
        // When it's set to true, Karma starts getting messed up and running tests multiple times when
        // such files are changed. o_O
        // Sounds like https://github.com/webpack/karma-webpack/issues/44
        watched: false,
        included: false,
        served: true
      },
      {
        pattern: 'testIndex.js',
        watched: false,
        included: true,
        served: true
      }
    ],

    // list of files to exclude
    exclude: ['**/*.test.js'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'testIndex.js': ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: reporters,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    //                  config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: argv.browsers,

    customLaunchers: {
      SL_CHROME: {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: 'latest'
      },
      SL_FIREFOX: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: 'latest'
      },
      SL_SAFARI: {
        base: 'SauceLabs',
        browserName: 'safari',
        version: 'latest'
      },
      SL_IE10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        version: '10'
      },
      SL_IE11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        version: '11'
      },
      SL_EDGE: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        version: 'latest'
      },
      SL_IOS: {
        base: 'SauceLabs',
        deviceName: 'iPhone XS Simulator',
        appiumVersion: '1.9.1',
        browserName: 'Safari',
        platformName: 'iOS',
        platformVersion: '12.0'
      },
      SL_ANDROID: {
        base: 'SauceLabs',
        deviceName: 'Android GoogleAPI Emulator',
        appiumVersion: '1.9.1',
        browserName: 'Chrome',
        platformName: 'Android',
        platformVersion: '7.1'
      }
    },

    sauceLabs: {
      buildId: buildId,
      testName: packageDescriptor.name + ' Test',
      tunnelIdentifier: process.env.GITHUB_RUN_NUMBER,
      startConnect: startConnect,
      retryLimit: 3,
      recordVideo: false,
      recordScreenshots: false,
      // https://support.saucelabs.com/hc/en-us/articles/115010079868-Issues-with-Safari-and-Karma-Test-Runner
      connectOptions: {
        noSslBumpDomains: 'all'
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: argv.singleRun,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    coverageIstanbulRer: {
      reports: ['html', 'lcovonly', 'text-summary'],
      'report-config': {
        html: {
          subdir: 'html'
        }
      },
      fixWebpackSourcePaths: true,
      combineBrowserReports: true
    },

    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,

    webpack: {
      devtool: false,
      mode: 'development',
      externals: {
        window: 'window',
        document: 'document'
      },
      resolve: {
        extensions: ['.js', '.jsx']
      },
      module: {
        rules: rules
      },
      plugins: [
        new DefinePlugin({
          TEST_BASE_PATH: JSON.stringify(process.cwd() + argv.testBasePath)
        }),
        new SourceMapDevToolPlugin({})
      ]
    },

    webpackServer: {
      stats: true,
      debug: false,
      progress: true,
      quiet: false
    }
  });
};

'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var path = require('path');
var KarmaServer = require('karma').Server;
var webpack = require('webpack-stream');
var DefinePlugin = require('webpack').DefinePlugin;

var $ = require('gulp-load-plugins')();

function startKarma(processor) {
  var options = {
    configFile: path.join(__dirname, 'karma.conf.js'),
    webpack: {
      devtool: '#inline-source-map',
      externals: [
        // For extensions we expose a "require" function that extension developers can use to
        // require in utilities that we specifically expose. This require function is custom
        // and provided by DTM. It is not intended to be interpreted by webpack, however webpack
        // doesn't know this and gets hung up on it because it can't find the module being required.
        // It would be great to just be able to tell webpack to ignore these particular references
        // to require but that's apparently not possible. Instead, this code makes it so that
        // each time webpack finds a require call that is:
        // 1. inside src/extensions
        // 2. outside any tests
        // 3. does not contain a period (in other words, doesn't have ./ or ../ like a
        //    normal require
        // it will create a mock module that just returns null instead of throwing an error
        // saying it can't find the referenced module on the file system.
        function(context, request, callback) {
          if (/^(?!.*__tests__$).*\/src\/.*$/.test(context) &&
            request.indexOf('.') === -1) {
            callback(null, 'var null');
          } else {
            callback();
          }
        },
        {
          // So that modules can require('window') and then tests can mock it.
          window: 'window',
          document: 'document'
        }
      ]
    }
  };

  if (processor) {
    processor(options);
  }

  new KarmaServer(options).start();
}

// Typically we wouldn't be dependent upon building the full engine and config (by running the
// "default" task first) since Karma would dynamically compile the pieces under test, but because
// we have functional tests that work within iframes and are dependent upon the full engine and
// config, this is necessary.
gulp.task('test', ['default'], function() {
  startKarma();
});

gulp.task('coverage', ['default'], function() {
  startKarma(function(options) {
    options.webpack.module = {
      preLoaders: [{
        test: /\.js$/,
        exclude: /(node_modules|__tests__)\//,
        loader: 'istanbul-instrumenter'
      }]
    };
    options.reporters = ['progress', 'coverage'];
    options.singleRun = true;
  });
});

gulp.task('testall', ['default'], function() {
  startKarma(function(options) {
    options.browsers = [
      'Chrome',
      'Firefox',
      'Safari',
      'IE9 - Win7',
      'IE10 - Win7',
      'IE11 - Win7'
    ];
  });
});

gulp.task('watch', function() {
  //gulp.watch(['./src/{,**/!(__tests__)}/*.js']);
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe($.eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe($.eslint.format('stylish'))
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe($.eslint.failAfterError());
});

gulp.task('default', ['watch']);

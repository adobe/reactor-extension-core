'use strict';

var gulp = require('gulp');
var webpack = require('webpack-stream');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');

require('turbine-gulp-testrunner')(gulp);

var webpackConfig = {
  output: {
    filename: 'view.js'
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|__tests__)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['transform-decorators-legacy']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'styl']
  },
  stylus: {
    use: [require('nib')()],
    import: [
      path.resolve('./node_modules/nib/lib/nib/index')
    ]
  }
};

gulp.task('buildJS', function() {
  return gulp.src('src/view/index.jsx')
    .pipe(sourcemaps.init())
    .pipe(webpack(webpackConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('copyHTML', function() {
  return gulp
    .src('src/view/index.html')
    .pipe(gulp.dest('dist'));
});

// Rename once turbine-gulp-builder has namespaced tasks
gulp.task('watch', function() {
  gulp.watch('src/view/**/*', ['buildJS']);
  gulp.watch('src/view/**/*.html', ['copyHTML']);
});

gulp.task('buildView', ['buildJS', 'copyHTML', 'watch']);

require('turbine-gulp-sandbox')(gulp, {
  buildViewTask: 'buildView'
});

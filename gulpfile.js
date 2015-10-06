'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
require('turbine-gulp-testrunner')(gulp);

gulp.task('watch', function() {
  //gulp.watch(['./src/{,**/!(__tests__)}/*.js']);
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format('stylish'))
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['watch']);

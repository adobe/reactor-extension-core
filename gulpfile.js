'use strict';

var gulp = require('gulp');
require('turbine-gulp-testrunner')(gulp);

gulp.task('watch', function() {
  //gulp.watch(['./src/{,**/!(__tests__)}/*.js']);
});

gulp.task('default', ['watch']);

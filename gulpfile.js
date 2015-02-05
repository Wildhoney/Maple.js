(function main() {

    var gulp   = require('gulp'),
        concat = require('gulp-concat'),
        karma  = require('gulp-karma'),
        jshint = require('gulp-jshint'),
        rename = require('gulp-rename');

    gulp.task('test', []);
    gulp.task('build', []);
    gulp.task('default', ['test', 'build']);

})();
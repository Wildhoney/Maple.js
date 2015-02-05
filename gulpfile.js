(function main() {

    var gulp    = require('gulp'),
        concat  = require('gulp-concat'),
        karma   = require('gulp-karma'),
        jshint  = require('gulp-jshint'),
        rename  = require('gulp-rename'),
        yaml    = require('js-yaml'),
        fs      = require('fs');

    var options = yaml.load(fs.readFileSync('maple.yml'));

    gulp.task('hint', function gulpHint() {

        return gulp.src(['src/*.js', 'src/components/*.js'])
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'));

    });

    gulp.task('test', []);
    gulp.task('build', []);
    gulp.task('default', ['test', 'build']);

})();
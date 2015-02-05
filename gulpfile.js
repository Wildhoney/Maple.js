(function main() {

    var gulp    = require('gulp'),
        concat  = require('gulp-concat'),
        karma   = require('gulp-karma'),
        jshint  = require('gulp-jshint'),
        rename  = require('gulp-rename'),
        uglify  = require('gulp-uglify'),
        yaml    = require('js-yaml'),
        fs      = require('fs');

    var options = yaml.load(fs.readFileSync('maple.yml')),
        files   = ['src/*.js', 'src/components/*.js'];

    gulp.task('hint', function gulpHint() {

        return gulp.src(files)
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'));

    });

    gulp.task('compile', function gulpCompileJs() {

        return gulp.src(files)
            .pipe(rename([options.name, 'js'].join('.')))
            .pipe(gulp.dest('dist'))
            .pipe(rename([options.name, 'min', 'js'].join('.')))
            .pipe(uglify())
            .pipe(gulp.dest('dist'));

    });


    gulp.task('test', ['hint']);
    gulp.task('build', ['compile']);
    gulp.task('default', ['test', 'build']);

})();
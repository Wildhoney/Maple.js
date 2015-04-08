(function main() {

    var gulp       = require('gulp'),
        traceur    = require('gulp-traceur'),
        concat     = require('gulp-concat'),
        karma      = require('gulp-karma'),
        jshint     = require('gulp-jshint'),
        rename     = require('gulp-rename'),
        uglify     = require('gulp-uglify'),
        yaml       = require('js-yaml'),
        browserify = require('browserify'),
        es6ify     = require('es6ify'),
        fs         = require('fs');

    var options = yaml.load(fs.readFileSync('maple.yml')),
        files   = ['src/Maple.js', 'src/modules/*.js'];

    gulp.task('hint', function gulpHint() {

        return gulp.src(files)
                   .pipe(jshint('.jshintrc'))
                   .pipe(jshint.reporter('default'));

    });

    gulp.task('compile', function gulpCompile() {

        return gulp.src(files)
                   .pipe(traceur({ modules: 'register' }))
                   .pipe(concat('all.js'))
                   .pipe(rename([options.name, 'js'].join('.')))
                   .pipe(gulp.dest('dist'))
                   .pipe(gulp.dest('example/vendor/maple'))
                   .pipe(rename([options.name, 'min', 'js'].join('.')))
                   .pipe(uglify())
                   .pipe(gulp.dest('dist'));

    });

    gulp.task('test', ['hint']);
    gulp.task('build', ['compile']);
    gulp.task('default', ['test', 'build']);
    gulp.task('watch', function() {
        gulp.watch(files, ['build']);
    })

})();
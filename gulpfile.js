(function main() {

    var gulp      = require('gulp'),
        concat    = require('gulp-concat'),
        karma     = require('gulp-karma'),
        jshint    = require('gulp-jshint'),
        rename    = require('gulp-rename'),
        uglify    = require('gulp-uglify'),
        hashsum   = require('gulp-hashsum'),
        traceur   = require('gulp-traceur'),
        vulcanize = require('gulp-vulcanize'),
        jsdoc     = require('gulp-jsdoc'),
        yaml      = require('js-yaml'),
        fs        = require('fs');

    var options = yaml.load(fs.readFileSync('maple.yml')),
        files   = ['src/*.js', 'src/components/*.js'];

    gulp.task('hint', function gulpHint() {

        return gulp.src(files)
                   .pipe(jshint('.jshintrc'))
                   .pipe(jshint.reporter('default'));

    });

    gulp.task('checksum', ['compile'], function gulpChecksum() {

        return gulp.src([options.name, '.js'])
                   .pipe(hashsum({ dest: 'dist/checksum', hash: 'md5' }))
                   .pipe(hashsum({ dest: 'dist/checksum', hash: 'sha1' }))
                   .pipe(hashsum({ dest: 'dist/checksum', hash: 'sha256' }));

    });

    gulp.task('vulcanize', function gulpVulcanize() {

        return gulp.src('example/index.html')
                   .pipe(vulcanize({
                       dest: 'dist',
                       strip: true
                   }))
                   .pipe(gulp.dest('dist'));

    });

    gulp.task('documentation', ['compile'], function gulpDocumentation() {

        return gulp.src([options.name, '.js'])
                   .pipe(jsdoc('docs'));

    });

    gulp.task('compile', function gulpCompile() {

        return gulp.src(files)
                   .pipe(traceur())
                   .pipe(rename([options.name, 'js'].join('.')))
                   .pipe(gulp.dest('dist'))
                   .pipe(rename([options.name, 'min', 'js'].join('.')))
                   .pipe(uglify())
                   .pipe(gulp.dest('dist'));

    });


    gulp.task('test', ['hint']);
    gulp.task('build', ['compile', 'documentation']);
    gulp.task('default', ['test', 'build']);

})();
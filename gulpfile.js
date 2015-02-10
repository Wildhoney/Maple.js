(function main() {

    var gulp       = require('gulp'),
        concat     = require('gulp-concat'),
        karma      = require('gulp-karma'),
        jshint     = require('gulp-jshint'),
        rename     = require('gulp-rename'),
        uglify     = require('gulp-uglify'),
        hashsum    = require('gulp-hashsum'),
        clean      = require('gulp-clean'),
        traceur    = require('gulp-traceur'),
        vulcanize  = require('gulp-vulcanize'),
        jsdoc      = require('gulp-jsdoc'),
        yaml       = require('js-yaml'),
        browserify = require('browserify'),
        es6ify     = require('es6ify'),
        fs         = require('fs');

    var options = yaml.load(fs.readFileSync('maple.yml')),
        files   = ['./src/Maple.js', 'src/internals/*.js'];

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

    gulp.task('karma', ['karma-build'], function gulpKarma() {

        var testFiles = [
            //'src/vendor/diff-dom/diffDOM.js',
            //'src/vendor/director/build/director.js',
            //'src/vendor/radio/radio.js',
            'tests/compile/maple.js',
            'tests/*.test.js',
            'tests/**/*.test.js'
        ];

        testFiles.concat(files);

        return gulp.src(testFiles).pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        })).on('error', function onError(error) {
            throw error;
        });

    });

    gulp.task('consuela', ['karma'], function gulpConsuela() {

        return gulp.src('tests/compile/*.js', { read: false })
                   .pipe(clean());

    });

    gulp.task('karma-build', function gulpKarmaBuild() {

        return browserify({ debug: true })
            .add(es6ify.runtime)
            .transform(es6ify)
            .require(require.resolve(files[0]), { entry: true })
            .bundle()
            .pipe(fs.createWriteStream('tests/compile/' + [options.name, 'js'].join('.')));

    });

    gulp.task('compile', function gulpCompile() {

        return gulp.src(files)
                   .pipe(traceur({ modules: 'register' }))
                   .pipe(concat('all.js'))
                   .pipe(rename([options.name, 'js'].join('.')))
                   .pipe(gulp.dest('dist'))
                   .pipe(rename([options.name, 'min', 'js'].join('.')))
                   .pipe(uglify())
                   .pipe(gulp.dest('dist'));

    });

    gulp.task('copy-vendor', function gulpCopyVendor() {

        return gulp.src('src/vendor/**/*', { base: 'src/vendor' })
                   .pipe(gulp.dest('example/vendor'));

    });

    gulp.task('copy-maple', ['compile'], function gulpCopyMaple() {

        return gulp.src('dist/maple.js')
                   .pipe(gulp.dest('example/vendor/maple'));

    });

    gulp.task('test', ['karma-build', 'karma', 'consuela', 'hint']);
    gulp.task('build', ['compile', 'copy-vendor', 'copy-maple', 'documentation']);
    gulp.task('default', ['test', 'build']);

})();
(function main() {

    var gulp       = require('gulp'),
        jshint     = require('gulp-jshint'),
        uglify     = require('gulp-uglify'),
        rimraf     = require('gulp-rimraf'),
        karma      = require('gulp-karma'),
        rename     = require('gulp-rename'),
        concat     = require('gulp-concat'),
        sass       = require('gulp-sass'),
        babel      = require('gulp-babel'),
        fs         = require('fs'),
        yaml       = require('js-yaml'),
        browserify = require('browserify'),
        babelify   = require('babelify');

    var config    = yaml.safeLoad(fs.readFileSync('maple.yml', 'utf8')).gulp,
        entryFile = config.entry,
        allFiles  = config.all,
        prodPath  = config.directories.dist + '/' + config.names.default.prod,
        devPath   = config.directories.dist + '/' + config.names.default.dev;

    /**
     * @method compile
     * @param {String} destPath
     * @param {String} [entryPath=entryFile]
     * @return Object
     */
    var compile = function(destPath, entryPath) {

        return browserify({ debug: true })
                .transform(babelify)
                .require(entryPath || entryFile, { entry: true, require: 'x' })
                .bundle()
                .on('error', function (model) { console.error(['Error:', model.message].join(' ')); })
                .pipe(fs.createWriteStream(destPath));

    };

    gulp.task('bundler', ['compile'], function() {

        return gulp.src([].concat(config.polyfills, [devPath]))
                   .pipe(concat('all.js'))
                   .pipe(rename(config.names.bundle.dev))
                   .pipe(gulp.dest(config.directories.dist))
                   .pipe(uglify())
                   .pipe(rename(config.names.bundle.prod))
                   .pipe(gulp.dest(config.directories.dist));

    });

    gulp.task('minify', ['compile'], function() {

        return gulp.src(devPath)
                   .pipe(rename(prodPath))
                   .pipe(uglify())
                   .pipe(gulp.dest(config.directories.dist));

    });

    gulp.task('compile', function() {
        return compile(devPath);
    });

    gulp.task('sass', function () {

        return gulp.src(config.sass)
                   .pipe(sass())
                   .pipe(gulp.dest(config.directories.css));

    });

    gulp.task('minify', ['compile'], function() {

        return gulp.src(devPath)
                   .pipe(uglify())
                   .pipe(rename(config.names.default.prod))
                   .pipe(rename(config.names.default.prod))
                   .pipe(gulp.dest(config.directories.dist));

    });

    gulp.task('vendorify', ['compile'], function() {

        return gulp.src(devPath)
                   .pipe(rename(config.names.default.dev))
                   .pipe(gulp.dest(config.directories.vendor));

    });

    gulp.task('lint', function() {

        return gulp.src(allFiles)
                   .pipe(jshint())
                   .pipe(jshint.reporter('default', {
                       verbose: true
                   }));

    });

    gulp.task('test', ['lint']);
    gulp.task('build', ['compile', 'vendorify', 'minify', 'bundler']);
    gulp.task('default', ['test', 'build']);
    gulp.task('watch', function watch() {
        gulp.watch(config.all, ['compile', 'vendorify']);
    });

})();
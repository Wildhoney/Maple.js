(function main() {

    var gulp       = require('gulp'),
        jshint     = require('gulp-jshint'),
        uglify     = require('gulp-uglify'),
        rimraf     = require('gulp-rimraf'),
        karma      = require('gulp-karma'),
        rename     = require('gulp-rename'),
        sass       = require('gulp-sass'),
        fs         = require('fs'),
        yaml       = require('js-yaml'),
        browserify = require('browserify'),
        babelify   = require('babelify');

    // Load the YAML configuration file.
    var config = yaml.safeLoad(fs.readFileSync('maple.yml', 'utf8'));

    // Common entry values.
    var entryFile = config.gulp.entry,
        allFiles  = config.gulp.all,
        prodPath  = config.gulp.directories.dist + '/' + config.gulp.names.prod,
        devPath   = config.gulp.directories.dist + '/' + config.gulp.names.dev;

    /**
     * @method compile
     * @param {String} destPath
     * @return Object
     */
    var compile = function(destPath) {

        return browserify({ debug: true })
                .transform(babelify)
                .require(entryFile, { entry: true })
                .bundle()
                .on('error', function (model) { console.error(['Error:', model.message].join(' ')); })
                .pipe(fs.createWriteStream(destPath));

    };

    gulp.task('compile', function() {
        return compile(devPath);
    });

    gulp.task('sass', function () {

        return gulp.src('./public/scss/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('./public/css'));

    });

    gulp.task('minify', ['compile'], function() {

        return gulp.src(devPath)
            .pipe(uglify())
            .pipe(rename(config.gulp.names.prod))
            .pipe(gulp.dest(config.gulp.directories.dist));

    });

    gulp.task('vendorify', ['compile'], function() {

        var devName = config.gulp.names.dev;

        return gulp.src(devPath)
            .pipe(rename(devName))
            .pipe(gulp.dest(config.gulp.directories.vendor));

    });

    gulp.task('lint', function() {

        return gulp.src(allFiles)
            .pipe(jshint())
            .pipe(jshint.reporter('default', {
                verbose: true
            }));

    });

    gulp.task('test', ['lint']);
    gulp.task('build', ['compile', 'vendorify']);
    gulp.task('default', ['test', 'build']);
    gulp.task('watch', function watch() {
        gulp.watch(config.gulp.all, ['build']);
    });

})();
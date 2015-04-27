(function main() {

    var gulp       = require('gulp'),
        jshint     = require('gulp-jshint'),
        uglify     = require('gulp-uglify'),
        rimraf     = require('gulp-rimraf'),
        karma      = require('gulp-karma'),
        rename     = require('gulp-rename'),
        concat     = require('gulp-concat'),
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
        prodPath  = config.gulp.directories.dist + '/' + config.gulp.names.defaultProd,
        devPath   = config.gulp.directories.dist + '/' + config.gulp.names.defaultDev;

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

    gulp.task('polyfill-bundler', ['compile'], function() {

        return gulp.src([].concat(config.gulp.polyfills, [devPath]))
                   .pipe(concat('all.js'))
                   .pipe(rename(config.gulp.names.bundleDev))
                   .pipe(gulp.dest(config.gulp.directories.dist))
                   .pipe(uglify())
                   .pipe(rename(config.gulp.names.bundleProd))
                   .pipe(gulp.dest(config.gulp.directories.dist));

    });

    gulp.task('minify', ['compile'], function() {

        return gulp.src(devPath)
                   .pipe(rename(prodPath))
                   .pipe(uglify())
                   .pipe(gulp.dest(config.gulp.directories.dist));

    });

    gulp.task('compile', function() {
        return compile(devPath);
    });

    gulp.task('sass', function () {

        return gulp.src('./example/scss/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('./example/css'));

    });

    gulp.task('minify', ['compile'], function() {

        return gulp.src(devPath)
            .pipe(uglify())
            .pipe(rename(config.gulp.names.defaultProd))
            .pipe(rename(config.gulp.names.defaultProd))
            .pipe(gulp.dest(config.gulp.directories.dist));

    });

    gulp.task('vendorify', ['compile'], function() {

        return gulp.src(devPath)
            .pipe(rename(config.gulp.names.defaultDev))
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
    gulp.task('build', ['compile', 'vendorify', 'minify', 'polyfill-bundler']);
    gulp.task('default', ['test', 'build']);
    gulp.task('watch', function watch() {
        gulp.watch(config.gulp.all, ['build']);
    });

})();
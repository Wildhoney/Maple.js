(function main() {

    var gulp        = require('gulp'),
        jshint      = require('gulp-jshint'),
        uglify      = require('gulp-uglify'),
        rename      = require('gulp-rename'),
        concat      = require('gulp-concat'),
        babel       = require('gulp-babel'),
        fs          = require('fs'),
        yaml        = require('js-yaml'),
        browserify  = require('browserify'),
        babelify    = require('babelify');

    var cfg       = yaml.safeLoad(fs.readFileSync('maple.yml', 'utf8')),
        entryFile = cfg.gulp.entry,
        allFiles  = cfg.gulp.all,
        prodPath  = cfg.gulp.directories.dist + '/' + cfg.gulp.names.default.prod,
        devPath   = cfg.gulp.directories.dist + '/' + cfg.gulp.names.default.dev;

    /**
     * @method compile
     * @param {String} destPath
     * @param {String} [entryPath=entryFile]
     * @return Object
     */
    var compile = function(destPath, entryPath) {

        return browserify({ debug: true })
                .transform(babelify)
                .require(entryPath || entryFile, { entry: true })
                .bundle()
                .on('error', function (model) { console.error(['Error:', model.message].join(' ')); })
                .pipe(fs.createWriteStream(destPath));

    };

    gulp.task('bundler', ['compile'], function() {

        return gulp.src([].concat(cfg.gulp.polyfills, [devPath]))
                   .pipe(concat('all.js'))
                   .pipe(rename(cfg.gulp.names.bundle.dev))
                   .pipe(gulp.dest(cfg.gulp.directories.dist))
                   .pipe(uglify())
                   .pipe(rename(cfg.gulp.names.bundle.prod))
                   .pipe(gulp.dest(cfg.gulp.directories.dist));

    });

    gulp.task('minify', ['compile'], function() {

        return gulp.src(devPath)
                   .pipe(rename(prodPath))
                   .pipe(uglify())
                   .pipe(gulp.dest(cfg.gulp.directories.dist));

    });

    gulp.task('compile', function() {
        return compile(devPath);
    });

    gulp.task('minify', ['compile'], function() {

        return gulp.src(devPath)
                   .pipe(uglify())
                   .pipe(rename(cfg.gulp.names.default.prod))
                   .pipe(rename(cfg.gulp.names.default.prod))
                   .pipe(gulp.dest(cfg.gulp.directories.dist));

    });

    gulp.task('vendorify', ['compile'], function() {

        return gulp.src(devPath)
                   .pipe(rename(cfg.gulp.names.default.dev))
                   .pipe(gulp.dest(cfg.gulp.directories.vendor));

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
        gulp.watch(cfg.gulp.all, ['compile', 'vendorify']);
    });

})();
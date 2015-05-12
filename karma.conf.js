module.exports = function(config) {

    var fs         = require('fs'),
        yaml       = require('js-yaml'),
        cfg        = yaml.safeLoad(fs.readFileSync('maple.yml', 'utf8'));

    var files = [
        { pattern: 'node_modules/karma-cucumberjs/vendor/cucumber-html.css', watched: false, included: false, served: true },
        { pattern: 'tests/compiled/app.template', watched: false, included: false, served: true },
        { pattern: 'tests/features/*.feature', watched: true, included: false, served: true },
        { pattern: 'tests/features/step_definitions/*.js', watched: true, included: true, served: true }
    ];

    cfg.karma.polyfills.forEach(function forEach(file) {
        files.push({ pattern: file, watched: false, included: true, served: true });
    });

    config.set({

        basePath: '',
        frameworks: ['cucumberjs'],
        files: files,
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: false,
        browsers: ['Chrome'],
        singleRun: false

    });

};

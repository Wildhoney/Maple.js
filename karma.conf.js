(function main() {

    module.exports = function(config) {

        config.set({

            basePath: '',
            frameworks: ['jasmine'],
            files: [
                'tests/*.test.js, tests/**/*.test.js'
            ],
            reporters: ['progress'],
            port: 9876,
            colors: true,
            logLevel: config.LOG_INFO,
            autoWatch: false,
            browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'Safari', 'Opera', 'IE', 'PhantomJS'],
            singleRun: true

        });
    };


})();
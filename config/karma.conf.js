module.exports = function (config) {
    var testWebpackConfig = require('./webpack.test.js')({env: 'test'});

    var configuration = {


        basePath: '',

        frameworks: ['jasmine'],

        /**
         * List of files to exclude.
         */
        exclude: [],

        client: {
            captureConsole: false
        },

        /**
         * List of files / patterns to load in the browser
         *
         * we are building the test environment in ./spec-bundle.js
         */
        files: [
            {pattern: './config/spec-bundle.js', watched: false},
            {pattern: './src/assets/**/*', watched: false, included: false, served: true, nocache: false}
        ],

        /**
         * By default all assets are served at http://localhost:[PORT]/base/
         */
        proxies: {
            "/assets/": "/base/src/assets/"
        },

        /**
         * Preprocess matching files before serving them to the browser
         * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
         */
        preprocessors: {'./config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap']},

        /**
         * Webpack Config at ./webpack.test.js
         */
        webpack: testWebpackConfig,

        coverageReporter: {
            type: 'in-memory'
        },

        remapCoverageReporter: {
            'text-summary': null,
            json: './coverage/coverage.json',
            html: './coverage/html'
        },

        /**
         * Webpack please don't spam the console when running in karma!
         */
        webpackMiddleware: {
            /**
             * webpack-dev-middleware configuration
             * i.e.
             */
            noInfo: true,
            /**
             * and use stats to turn off verbose output
             */
            stats: {
                /**
                 * options i.e.
                 */
                chunks: false
            }
        },

        reporters: ['mocha', 'coverage', 'remap-coverage'],

        /**
         * Web server port.
         */
        port: 9876,

        colors: true,

        logLevel: config.LOG_WARN,

        autoWatch: false,

        browsers: [
            'Chrome'
        ],

        customLaunchers: {
            ChromeTravisCi: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        singleRun: true
    };

    if (process.env.TRAVIS) {
        configuration.browsers = [
            'ChromeTravisCi'
        ];
    }

    config.set(configuration);
};

// Karma configuration
// Generated on 2017-03-30

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/lodash/lodash.js',
      'bower_components/restangular/dist/restangular.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-ui-grid/ui-grid.js',
      'bower_components/chosen/chosen.jquery.js',
      'bower_components/angular-chosen-localytics/dist/angular-chosen.js',
      'bower_components/angular-pretty-checkable/dist/angular-pretty-checkable.min.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.js',
      'bower_components/tinycolor/tinycolor.js',
      'bower_components/angular-color-picker/dist/angularjs-color-picker.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/ng-file-upload-shim/ng-file-upload-shim.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/angular-linq/angular-linq.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-confirm/js/angular-confirm.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/angular-cookie/angular-cookie.js',
      'bower_components/blob-polyfill/Blob.js',
      'bower_components/file-saver.js/FileSaver.js',
      'bower_components/angular-file-saver/dist/angular-file-saver.bundle.js',
      'bower_components/ScrollToFixed/jquery-scrolltofixed.js',
      'bower_components/angular-scrolltofixed/src/scrollToFixed.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/d3/d3.js',
      'bower_components/vega/vega.js',
      'bower_components/vega-lite/vega-lite.js',
      'bower_components/viscompass/compass.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};

'use strict';

/**
 * @ngdoc overview
 * @name YeoAngular
 * @description
 * # YeoAngular
 *
 * Main module of the application.
 */
angular
  .module('YeoAngular', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch', 'ui.bootstrap', 'ngTouch',
    'ui.grid', 'ui.grid.selection',
    'ui.grid.pagination', 'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'localytics.directives',
    'pretty-checkable',
    'color.picker',
    'LocalStorageModule',
    'ngFileUpload',
    'angularMoment',
    'angular-linq',
    'cp.ngConfirm',
    'angular-loading-bar', 'ngAnimate',
    'com.devnup.color',
    'ui.select',
    'ipCookie',
    'ngFileSaver',
    'scrollToFixed',
    'restangular', 'YeoAngular.services', 'YeoAngular.controllers', 'YeoAngular.constants.module'
  ])
  .config(['$routeProvider', '$locationProvider', 'environmentSettingProvider', 'RestangularProvider', 'localStorageServiceProvider', 'uiSelectConfig',
    function ($routeProvider, $locationProvider, environmentSettingProvider, RestangularProvider, localStorageServiceProvider, uiSelectConfig) {

      //$locationProvider.html5Mode(true);
      $routeProvider
        .when('/main', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
        })
        .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl',
          controllerAs: 'login'
        })
        .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl',
          controllerAs: 'about'
        })
        .otherwise({
          redirectTo: '/main'
        });

      var currentEnvironment = 'DEV', //MOCK, LOCAL, DEV, STAGE, PROD
        environment = '';

      environmentSettingProvider.setEnvironment(currentEnvironment);
      environment = environmentSettingProvider.$get();


      // Restangular configuration
      var baseUrl = environment.BASE_URL;
      RestangularProvider.setBaseUrl(baseUrl);

      RestangularProvider.setDefaultHttpFields({ cache: false });
      RestangularProvider.setDefaultHeaders({
        'Content-Type': 'application/json'
      });
      RestangularProvider.setMethodOverriders(['put', 'patch']);
      
      uiSelectConfig.theme = 'bootstrap';
      uiSelectConfig.resetSearchInput = true;
      uiSelectConfig.appendToBody = true;

      localStorageServiceProvider
        .setPrefix('YeoAngular')
        .setStorageType('localStorage') //.setStorageType('sessionStorage')
        .setNotify(true, true);

    }]);

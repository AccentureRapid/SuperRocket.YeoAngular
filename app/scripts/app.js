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
    'ngTouch','ui.bootstrap','restangular','YeoAngular.services','YeoAngular.controllers','YeoAngular.constants.module'
  ])
  .config(['$routeProvider','$locationProvider','environmentSettingProvider','RestangularProvider',
  function ($routeProvider, $locationProvider , environmentSettingProvider, RestangularProvider) {

    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });

      var currentEnvironment = 'LOCAL', //MOCK, LOCAL, DEV, STAGE, PROD
      environment = '';

  environmentSettingProvider.setEnvironment(currentEnvironment);
  environment = environmentSettingProvider.$get();


  // Restangular configuration
  var baseUrl = environment.BASE_URL;
  RestangularProvider.setBaseUrl(baseUrl);

  RestangularProvider.setDefaultHttpFields({ cache: false });
  RestangularProvider.setDefaultHeaders({
      "Content-Type": "application/json"
  });
  RestangularProvider.setMethodOverriders(["put", "patch"]);

  }]);

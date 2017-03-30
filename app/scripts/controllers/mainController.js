'use strict';

/**
 * @ngdoc function
 * @name YeoAngular.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the YeoAngular.controllers
 */
angular.module('YeoAngular.controllers', [])
  .controller('MainCtrl', ['$scope','mainService',function ($scope, mainService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

     $scope.loginData = {};
     $scope.loginData.userName = "test";
     $scope.loginData.password = "test";

     $scope.doLogin = function() {

     mainService.login($scope.loginData).then(function (result) {
          if (result.Id > 0)
          {
            console.log("login successfully.");
          }else
          {
            console.log("login failed please check your username and password.");
          }
     });
  };
  }]);

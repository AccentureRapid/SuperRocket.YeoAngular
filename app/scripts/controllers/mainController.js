'use strict';

/**
 * @ngdoc function
 * @name YeoAngular.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the YeoAngular.controllers
 */
angular.module('YeoAngular.controllers', [])
  .controller('MainCtrl', ['$scope','$log','mainService',function ($scope, $log, mainService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
      $log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;

     $scope.loginData = {};
     $scope.loginData.userName = "test";
     $scope.loginData.password = "test";

     $scope.doLogin = function() {

     mainService.login($scope.loginData).then(function (result) {
          if (result.Id > 0)
          {
            //$log.log("login successfully.");
          }else
          {
            //$log.log("login failed please check your username and password.");
          }
     });
  };
  }]);

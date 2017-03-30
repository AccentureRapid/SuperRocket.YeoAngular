'use strict';

/**
 * @ngdoc function
 * @name YeoAngular.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the YeoAngular.controllers
 */
angular.module('YeoAngular.controllers', [])
  .controller('MainCtrl', ['$scope', '$log', 'mainService', function ($scope, $log, mainService) {

    //Paging
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
      $log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
    //Paging

    //Grid
    $scope.myData = [
      {
        'firstName': 'Cox',
        'lastName': 'Carney',
        'company': 'Enormo',
        'employed': true
      },
      {
        'firstName': 'Lorraine',
        'lastName': 'Wise',
        'company': 'Comveyer',
        'employed': false
      },
      {
        'firstName': 'Nancy',
        'lastName': 'Waters',
        'company': 'Fuelton',
        'employed': false
      }
    ];

    $scope.gridOptions = {
      enableRowSelection: true,
      enableSelectAll: true,
      selectionRowHeaderWidth: 35,
      rowHeight: 35,
      showGridFooter: true
    };

    $scope.gridOptions.columnDefs = [
      { name: 'firstName' },
      { name: 'lastName' },
      { name: 'company', displayName: 'Company', allowCellFocus: false },
      { name: 'employed', displayName: 'Active' }
    ];
    $scope.gridOptions.data = $scope.myData;
    $scope.gridOptions.multiSelect = true;
    //Grid

    $scope.loginData = {};
    $scope.loginData.userName = 'test';
    $scope.loginData.password = 'test';

    $scope.doLogin = function () {

      mainService.login($scope.loginData).then(function (result) {
        if (result.Id > 0) {
          $log.log('login successfully.');
        } else {
          $log.log('login failed please check your username and password.');
        }
      });
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name YeoAngular.controllers:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the YeoAngular.controllers
 */
angular.module('YeoAngular.controllers')
  .controller('LoginCtrl', ['$scope', '$log', '$location', 'mainService', 'localStorageService',
    'environmentSetting', '$ngConfirm',
    function ($scope, $log, $location, mainService, localStorageService, environmentSetting, $ngConfirm) {
      $scope.loginData = {};
      $scope.showMessage = false;

      $scope.doLogin = function () {
        $scope.loginData.message = '';
        mainService.login($scope.loginData).then(function (result) {
          if (result.userId > 0) {
            $log.log('login successfully.');
            localStorageService.set(environmentSetting.sessionStorageKeys.currentUser, result);
            //environmentSetting.session.SESSION_ID = result.sessionid;
            localStorageService.set(environmentSetting.session.SESSION_ID, 'test123');
            $ngConfirm({
              title: '提示',
              content: '登录成功.',
              autoClose: 'close|1000',
              type: 'green',
              typeAnimated: true,
              buttons: {
                close: {
                  text: '关闭',
                  action: function () {
                    $log.log('close button clicked。');
                  }
                }
              }
            });
            $location.path('/main');
          } else {
            $log.log('login failed please check your username and password.');
            $scope.loginData.message = '用户名密码不正确.';
            $scope.showMessage = true;
          }
        });
      };
    }]);

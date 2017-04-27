'use strict';

/**
 * @ngdoc function
 * @name YeoAngular.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the YeoAngular.controllers
 */
angular.module('YeoAngular.controllers', [])
  .controller('MainCtrl', ['$rootScope', '$scope', '$log', '$location', 'mainService',
    'i18nService', 'uiGridConstants', 'localStorageService', 'environmentSetting', '$uibModal',
    '$linq', '$ngConfirm', '$interval', 'FileSaver', 'Blob','moment',
    function ($rootScope, $scope, $log, $location, mainService, i18nService,
      uiGridConstants, localStorageService, environmentSetting, $uibModal, $linq, $ngConfirm, $interval, FileSaver, Blob,moment) {
      //设为已判定 设为未判定 diable these buttons
      $scope.disabledButtonDetermined = false;
      $scope.disabledButtonNotYetDetermined = false;
      $scope.disabledButtonStartToDetermine = false;
      $scope.disabledButtonExport = false;
      //anylyze process
      $scope.isAnalyzeProcessButtonShow = false;

      //0,1,2 1分析中,2分析完成
      $scope.startAnalyzeProcessTimer = function () {
        function error() {
          console.log('error');
        }
        function notify() {
          console.log('notify');
        }
        function success() {
          console.log('success');
        }
        $scope.timer = $interval(function () {
          mainService.getAnalyzeProcess().then(function (result) {
            $rootScope.$broadcast('onShouldBeInitialized');
            if (result.status === 2) {
              $scope.isAnalyzeProcessButtonShow = false;
              $interval.cancel($scope.timer);
            }else{
              $scope.isAnalyzeProcessButtonShow = true;
            }
          });
        }, 5000);
        $scope.timer.then(success, error, notify);
      };
      $scope.startAnalyzeProcessTimer();
      //double click to go to readonly mode
      //show save button by default
      $rootScope.showButtonSave = true;
      //relevant number input readonly
      $rootScope.isRelevantEditBoxReadonly = false;

      $scope.myData = [];
      //check if user is logged in.
      $scope.checkIfUserLoggedIn = function () {
        var storageType = localStorageService.getStorageType();
        $log.log('storage type : ' + storageType);

        var user = localStorageService.get(environmentSetting.sessionStorageKeys.currentUser);
        if (user === null) {
          $location.path('/login');
          $rootScope.showLogout = false;
        } else {
          $rootScope.user = user;
          $rootScope.showLogout = true;
        }
      };

      //pagination setting
      $scope.totalItems = $scope.myData.length;
      $scope.currentPage = 1;
      $scope.itemsPerPage = 10;
      $scope.pagingSizes = [10, 20, 50, 100];

      $scope.setPagingSize = function (size) {
        $scope.itemsPerPage = size;
        $scope.pageChanged();
      };

      $scope.pageChanged = function () {
        $scope.setPagingData($scope.myData, $scope.currentPage, $scope.itemsPerPage);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        $log.log('Page changed to: ' + $scope.currentPage);
        $scope.gridOptions.paginationPageSize = $scope.itemsPerPage;
        $log.log($scope.gridOptions.paginationPageSize);
      };

      $scope.maxSize = 5;

      //ui-grid options
      $scope.gridOptions = {
        enablePaginationControls: false,
        paginationPageSizes: [10, 20, 50],
        paginationPageSize: $scope.itemsPerPage,
        enableHorizontalScrollbar : false,
        enableVerticalScrollbar : true,
        enableRowSelection: true,
        enableSelectAll: true,
        enableFullRowSelection: true,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: false,
        appScopeProvider: {
          onDblClick: function (row) {
            $rootScope.selectedCase = row.entity;
            $rootScope.showButtonSave = false;
            $rootScope.isRelevantEditBoxReadonly = true;
            $location.path('/about');
            $log.log('double clicked.' + row);
          }
        },
        rowTemplate: 'views/rowTemplate.html'
      };
      //get current page's data.
      $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
      };

      $scope.setPagingData = function (data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.pagedData = pagedData;
        $scope.totalItems = data.length;
        $scope.gridOptions.data = angular.copy($scope.pagedData);
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        $log.log($scope.gridOptions.paginationPageSize);
      };
      // get the selected rows
      $scope.getSelectedRowsCount = function () {
        return $scope.gridApi.selection.getSelectedRows().length;
      };

      $scope.gridOptions.columnDefs = [
        { name: 'num', displayName: '管理番号' },
        { name: 'username', displayName: '更新人' },
        { name: 'updated_time', displayName: '更新时间', cellFilter: 'amUtc | amLocal | amDateFormat:"YYYY-MM-DD HH:mm:ss"' },
        { name: 'death_count', displayName: '死亡' },
        { name: 'serious_count', displayName: '重笃' },
        { name: 'not_serious_count', displayName: '非重笃' },
        { name: 'judge_flag', displayName: '状态', cellFilter: 'flagFilter' }
      ];

      $scope.gridOptions.multiSelect = true;

      $scope.initialize = function () {
        //1. check if user authenticated
        $scope.checkIfUserLoggedIn();
        //2. set the ui-grid's lang
        i18nService.setCurrentLang('zh-cn');
        //3. prepare data for ui-grid
        mainService.getCases().then(function (result) {
          $scope.myData = result;
          var queryResult = $linq.Enumerable().From($scope.myData)
            .Where(function (x) {
              return x.id > 0;
            })
            .OrderBy(function (x) {
              return x.id;
            })
            .Select(function (x) {
              return x.id + ':' + x.num;
            })
            .ToArray();
          $log.log(queryResult);
          $scope.setPagingData($scope.myData, $scope.currentPage, $scope.itemsPerPage);

        });

        mainService.getApplicationData().then(function (result) {
          localStorageService.set(environmentSetting.sessionStorageKeys.applicationData, result);
        });
      };

      $scope.$watch('getSelectedRowsCount()', function (count) {
        var disabled = count === 1 ? false : true;
        $scope.disabledButtonStartToDetermine = disabled;
        if (count >= 1) {
          $scope.disabledButtonExport = false;
          $scope.disabledButtonNotYetDetermined = false;
          $scope.disabledButtonDetermined = false;
        } else {
          $scope.disabledButtonExport = true;
          $scope.disabledButtonNotYetDetermined = true;
          $scope.disabledButtonDetermined = true;
        }

      });

      $scope.initialize();

      $scope.export = function () {
        var selectedRows = $scope.gridApi.selection.getSelectedRows();
        var ids = [];
        if (selectedRows) {
          angular.forEach(selectedRows, function (data) {
            if (data.id) {
              ids.push(data.id);
              $log.log(data);
            }
          });
        }
        if (ids.length > 0) {
          mainService.export(ids).then(function (result) {
            //application/vnd.ms-excel
            var file = new Blob([result], { type: 'application/vnd.ms-excel;charset=utf-8' });
            var name = moment().format('YYYY-MM-DD HH-mm-ss');
            var fileName =  'pv-' + name + '.xls';
            FileSaver.saveAs(file, fileName);
            $log.log(fileName);
          }, function (response) {
            $ngConfirm({
              title: '提示',
              content: '导出失败：' + response.status,
              autoClose: 'close|1000',
              type: 'red',
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
          });
        }
      };

      $scope.batchJudge = function (flag, showMessageBox) {
        var selectedRows = $scope.gridApi.selection.getSelectedRows();
        var ids = [];
        if (selectedRows) {
          angular.forEach(selectedRows, function (data) {
            if (data.id) {
              ids.push(data.id);
              $log.log(data);
            }
          });
        }
        if (ids.length > 0) {
          var data = {};
          data.userId = $rootScope.user.userId;
          data.ids = ids;
          data.flag = flag;
          mainService.batchJudge(data).then(function (result) {
            if (showMessageBox) {
              $ngConfirm({
                title: '提示',
                content: '判定成功.',
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
            }
            $scope.initialize();
            $log.log(result);
          }, function (response) {
            $log.log('Error with status code', response.status);
          });
        }
      };

      //open modal dialogue for upload view
      $scope.OpenUploadView = function () {

        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'views/upload.html',
          controller: 'UploadCtrl',
          size: 'md',
          resolve: {
            items: function () {

            }
          }
        });

        modalInstance.result.then(function () {
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });

      };

      $scope.start = function () {
        if ($scope.gridApi.selection.getSelectedRows().length > 0) {
          $rootScope.selectedCase = $scope.gridApi.selection.getSelectedRows()[0];
          $scope.batchJudge(1, false);
          $location.path('/about');
        }
      };

      $rootScope.logout = function () {
        localStorageService.set(environmentSetting.sessionStorageKeys.currentUser, null);
        $scope.checkIfUserLoggedIn();
      };

      $rootScope.$on('onShouldBeInitialized', function () {
        $scope.initialize();
      });
      $rootScope.$on('onShouldStartAnalyzeProcessTimer', function () {
        $scope.startAnalyzeProcessTimer();
      });
    }])
  .controller('UploadCtrl', ['$rootScope', '$scope', '$location', '$log', 'localStorageService', '$ngConfirm',
    'environmentSetting', '$uibModalInstance', 'Upload',
    function ($rootScope, $scope, $location, $log, localStorageService, $ngConfirm, environmentSetting, $uibModalInstance, Upload) {

      $scope.ok = function () {
        $uibModalInstance.close();
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.submit = function () {
        if ($scope.form.file.$valid && $scope.file) {
          $scope.upload($scope.file);
        }
      };

      // upload on file select or drop
      $scope.upload = function (file) {
        Upload.upload({
          url: environmentSetting.BASE_URL + environmentSetting.YeoAngularRoutes.upload,
          data: { file: file, userId: $rootScope.user.userId }
        }).then(function (resp) {
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          $rootScope.$broadcast('onShouldBeInitialized');
          $rootScope.$broadcast('onShouldStartAnalyzeProcessTimer');
          $ngConfirm({
            title: '提示',
            content: '上传成功.',
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
        }, function (resp) {
          console.log('Error status: ' + resp.status);
          $ngConfirm({
            title: '提示',
            content: '上传失败：' + resp.status,
            autoClose: '关闭|1000',
            type: 'red',
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
        }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      };

    }]);
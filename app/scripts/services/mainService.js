'use strict';

angular.module('YeoAngular.services', [])
    .factory('mainService.data', ['Restangular','environmentSetting',
        function (Restangular,environmentSetting) {
            return {
                login: function (data) {
                    var url = environmentSetting.YeoAngularRoutes.login;
                    return Restangular.all(url).post(data);
                } 
            };
        }
    ])
    .factory('mainService', ['$rootScope','mainService.data',
        function ($rootScope, mainServiceModel) {
            var viewModels = {
                login: function (data) {
                    return mainServiceModel.login(data).then(function (result) {
                        return result;
                    });
                }
            };

            
         return viewModels;
}]);
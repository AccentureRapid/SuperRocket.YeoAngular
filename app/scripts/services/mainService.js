'use strict';

angular.module('YeoAngular.services', [])
    .factory('mainService.data', ['Restangular', 'environmentSetting', 'localStorageService',
        function (Restangular, environmentSetting, localStorageService) {

            // Restangular.withConfig(function (RestangularConfigurer) {
            //     RestangularConfigurer.setBaseUrl('http://www.bing.com');
            // });
            Restangular.addRequestInterceptor(function (element, operation, what, url) {
                if (operation === 'put' && what === 'product' && url === 'login') {

                }
                return element;
            });
            Restangular.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
                if (operation === 'put' && what === 'product' && url === 'login' && headers && params && httpConfig) {

                }
                if (true) {
                    var token = localStorageService.get(environmentSetting.session.SESSION_ID);
                    if (token) {
                        //TODO current comment it for developing
                        //headers.Authorization = 'Bearer ' + token;
                    }

                }
                return {
                    element: element,
                    headers: headers,
                    params: params,
                    httpConfig: httpConfig
                };
            });
            Restangular.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                if (data && operation && what && url && response && deferred) {

                }

                return data;
            });

            Restangular.setErrorInterceptor(function (response, deferred, responseHandler, $http) {
                if (response.status === 403 || response.status === 302) {
                    //clean current user to force to login again and store the token into cache
                    localStorageService.set(environmentSetting.sessionStorageKeys.currentUser, null);
                    // refreshAccesstoken().then(function () {
                    //     // Repeat the request and then call the handlers the usual way.
                    $http(response.config).then(responseHandler, deferred.reject);
                    //     // Be aware that no request interceptors are called this way.
                    // });
                    return false;
                }
                return true;
            });
            return {
                getApplicationData: function () {
                    var url = environmentSetting.YeoAngularRoutes.getApplicationData;
                    return Restangular.one(url).get();
                },
                login: function (data) {
                    var url = environmentSetting.YeoAngularRoutes.login;
                    return Restangular.all(url).post(data);
                    //return Restangular.one(url).get(data);
                },
                getCases: function () {
                    var url = environmentSetting.YeoAngularRoutes.getCases;
                    return Restangular.all(url).getList();
                },
                saveCase: function (data) {
                    var url = environmentSetting.YeoAngularRoutes.saveCase;
                    return Restangular.all(url).post(data);
                },
                getCaseDetail: function (data) {
                    var url = environmentSetting.YeoAngularRoutes.getCaseDetail;
                    return Restangular.all(url).post(data);
                    //return Restangular.one(url).get(data);
                },
                export: function (data) {
                    var url = environmentSetting.YeoAngularRoutes.export;
                    //return Restangular.all(url).post(data);
                    return Restangular.all(url).withHttpConfig({responseType: 'blob'}).customPOST(data, undefined, undefined, {'Content-Type': 'application/vnd.ms-excel;charset=utf-8' });
                },
                batchJudge: function (data) {
                    var url = environmentSetting.YeoAngularRoutes.batchJudge;
                    return Restangular.all(url).post(data);
                },
                saveSeriousObject: function (data) {
                    var url = environmentSetting.YeoAngularRoutes.saveSeriousObject;
                    return Restangular.all(url).post(data);
                },
                saveRelevantNumber: function (data) {
                    var url = environmentSetting.YeoAngularRoutes.saveRelevantNumber;
                    return Restangular.all(url).post(data);
                },
                getAnalyzeProcess: function () {
                    var url = environmentSetting.YeoAngularRoutes.getAnalyzeProcess;
                    return Restangular.one(url).get();
                }
            };
        }
    ])
    .factory('mainService', ['$rootScope', 'mainService.data',
        function ($rootScope, mainServiceModel) {
            var services = {
                getApplicationData: function () {
                    return mainServiceModel.getApplicationData().then(function (result) {
                        return result;
                    });
                },
                login: function (data) {
                    return mainServiceModel.login(data).then(function (result) {
                        return result;
                    });
                },
                getCases: function () {
                    return mainServiceModel.getCases().then(function (result) {
                        return result;
                    });
                },
                saveCase: function (data) {
                    return mainServiceModel.saveCase(data).then(function (result) {
                        return result;
                    });
                },
                getCaseDetail: function (data) {
                    return mainServiceModel.getCaseDetail(data).then(function (result) {
                        return result;
                    });
                },
                export: function (data) {
                    return mainServiceModel.export(data).then(function (result) {
                        return result;
                    });
                },
                batchJudge: function (data) {
                    return mainServiceModel.batchJudge(data).then(function (result) {
                        return result;
                    });
                },
                saveSeriousObject: function (data) {
                    return mainServiceModel.saveSeriousObject(data).then(function (result) {
                        return result;
                    });
                },
                saveRelevantNumber: function (data) {
                    return mainServiceModel.saveRelevantNumber(data).then(function (result) {
                        return result;
                    });
                },
                getAnalyzeProcess: function () {
                    return mainServiceModel.getAnalyzeProcess().then(function (result) {
                        return result;
                    });
                }
            };


            return services;
        }]);
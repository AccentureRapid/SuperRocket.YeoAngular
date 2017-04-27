'use strict';

angular.module('YeoAngular.constants.module', [])
    .constant('YeoAngular.constants', {

    })
    .constant('YeoAngular.constants.environment', {
        PROD: {
            ENV: 'PROD',
            BASE_URL: 'http://agile.dystudio.cn/api/'
        },
        STAGE: {
            ENV: 'STAGE',
            BASE_URL: 'http://localhost:8080/api/'
        },
        DEV: {
            ENV: 'DEV',
            BASE_URL: 'http://localhost/api/'
        },
        LOCAL: {
            ENV: 'LOCAL',
            BASE_URL: 'http://localhost:9099/api/'
        },
        MOCK: {
            ENV: 'MOCK',
            BASE_URL: 'http://localhost:9000/api/'
        }
    })

    .provider('environmentSetting', ['YeoAngular.constants.environment', function (envs) {
        var CONFIG_MOCK = {
            YeoAngularRoutes: {
                getApplicationData:'data/application_data.json',
                login: 'data/login.json',
                getCases: 'data/getCases.json',
                saveCase:'data/getCases.json',
                getCaseDetail:'data/getCaseDetail.json',
                upload:'data/upload.json',
                export:'data/export.json',
                batchJudge:'data/batchJudge.json',
                saveSeriousObject:'data/saveSeriousObject.json',
                saveRelevantNumber:'relevant_num_save',
                getAnalyzeProcess:'get_prediction_state/'
            },
            sessionStorageKeys: {
                currentUser: 'Current_User',
                applicationData: 'Application_Data'
            },
            session:{
                SESSION_ID:'sessionid'
            }
        },
        CONFIG_ENV = {
            YeoAngularRoutes: {
                getApplicationData:'get_app_data/',
                login: 'login/',
                getCases: 'list/',
                saveCase:'judge_save/',
                getCaseDetail:'detail/',
                upload:'upload/',
                export:'export/',
                batchJudge:'batch_judge/',
                saveSeriousObject:'event_save/',
                saveRelevantNumber:'relevant_num_save/',
                getAnalyzeProcess:'get_prediction_state/'
            },
            sessionStorageKeys: {
                currentUser: 'Current_User',
                applicationData: 'Application_Data'
            },
            session:{
                SESSION_ID:'sessionid'
            }
        },
        config = {
            common: {
                authorize: 'nonce',
                upload: 'media',
                region: 'ip-country'
            }
        };


        this.setEnvironment = function (environment) {
            if (environment === envs.MOCK.ENV) {
                CONFIG_MOCK.BASE_URL = envs.MOCK.BASE_URL;
                CONFIG_MOCK.ESO_URL = envs.MOCK.ESO_URL;
                CONFIG_MOCK.ADMIN_URL = envs.MOCK.ADMIN_URL;
                config = CONFIG_MOCK;
            }
            else if (environment === envs.LOCAL.ENV) {
                CONFIG_ENV.BASE_URL = envs.LOCAL.BASE_URL;
                CONFIG_ENV.ESO_URL = envs.LOCAL.ESO_URL;
                CONFIG_ENV.ADMIN_URL = envs.LOCAL.ADMIN_URL;
                config = CONFIG_ENV;
            }
            else if (environment === envs.DEV.ENV) {
                CONFIG_ENV.BASE_URL = envs.DEV.BASE_URL;
                CONFIG_ENV.ESO_URL = envs.DEV.ESO_URL;
                CONFIG_ENV.ADMIN_URL = envs.DEV.ADMIN_URL;
                config = CONFIG_ENV;
            }
            else if (environment === envs.STAGE.ENV) {
                CONFIG_ENV.BASE_URL = envs.STAGE.BASE_URL;
                CONFIG_ENV.ESO_URL = envs.STAGE.ESO_URL;
                CONFIG_ENV.ADMIN_URL = envs.STAGE.ADMIN_URL;
                config = CONFIG_ENV;
            }
            else if (environment === envs.PROD.ENV) {
                CONFIG_ENV.BASE_URL = envs.PROD.BASE_URL;
                CONFIG_ENV.ESO_URL = envs.PROD.ESO_URL;
                CONFIG_ENV.ADMIN_URL = envs.PROD.ADMIN_URL;
                config = CONFIG_ENV;
            }
        };

        this.$get = function () {
            return config;
        };
    }])

    .run(['$rootScope', 'YeoAngular.constants', function ($rootScope, constants) {
        $rootScope.constants = constants;
    }]);
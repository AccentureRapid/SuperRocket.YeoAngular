'use strict';

/**
 * @ngdoc function
 * @name YeoAngular.controllers:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the YeoAngular.controllers
 */
angular.module('YeoAngular.controllers')
    .controller('AboutCtrl', ['$rootScope', '$scope', '$location', '$log', 'localStorageService', '$color',
        'environmentSetting', 'mainService', '$ngConfirm', '$linq', '$uibModal',
        function ($rootScope, $scope, $location, $log, localStorageService, $color,
            environmentSetting, mainService, $ngConfirm, $linq, $uibModal) {
            //generate colors
            $scope.count = 100000;
            $scope.rgbToHex = function (red, green, blue) {
                var decColor = red + 256 * green + 256 * 256 * blue;
                return '#' + decColor.toString(16);
            };
            $scope.colors = (function () {
                var colors = localStorageService.get('APPLICATION_COLORS');
                if (colors) {
                    return colors;
                } else {
                    colors = $color.generate($scope.count).map(function (c) {
                        return {
                            color: $scope.rgbToHex(c[0], c[1], c[2])
                        };
                    });
                    localStorageService.set('APPLICATION_COLORS', colors);
                }
                return colors;
            })();
            //color picker options
            // options - if a list is given then choose one of the items. The first item in the list will be the default
            $scope.options = {
                // color
                format: 'rgb',
                restrictToFormat: false,
                hue: true,
                saturation: false,
                lightness: false, // Note: In the square mode this is HSV and in round mode this is HSL
                alpha: true,
                case: 'upper',
                //swatch
                //swatch: [true],
                //swatchPos: ['left'],
                //swatchBootstrap: [true],
                swatchOnly: true,
                // popup
                //round: [false],
                //pos: ['bottom left'],
                //inline: [false],
                // show/hide
                show: {
                    swatch: true,
                    focus: true
                },
                hide: {
                    blur: true,
                    escape: true,
                    click: true
                },
                // buttons
                close: {
                    show: true,
                    label: '关闭',
                    class: ''
                },
                clear: {
                    show: false,
                    label: 'Clear',
                    class: ''
                },
                reset: {
                    show: true,
                    label: '重置',
                    class: ''
                }
            };
            $scope.api = {};
            // $scope.api.open();       // opens the popup
            // $scope.api.close();      // closes the popup
            // $scope.api.clear();      // removes value
            // $scope.api.reset();      // resets color value to original value
            // $scope.api.getElement(); // returns the wrapping <color-picker> element
            // $scope.api.getScope();   // returns the color picker $scope

            // api event handlers
            $scope.eventApi = {
                onChange: function (api, color, $event) {
                    $log.log(api + color + $event);
                },
                onBlur: function (api, color, $event) {
                    $log.log(api + color + $event);
                },
                onOpen: function (api, color, $event) {
                    $log.log(api + color + $event);
                },
                onClose: function (api, color, $event) {
                    $log.log(api + color + $event);
                    $scope.$broadcast('analyzeTriggered');
                },
                onClear: function (api, color, $event) {
                    $log.log(api + color + $event);
                },
                onReset: function (api, color, $event) {
                    $log.log(api + color + $event);
                },
                onDestroy: function (api, color) {
                    $log.log(api + color);
                },
            };
            $scope.initializeColorForEvents = function (events) {
                var temp = [];
                angular.forEach(events, function (data) {
                    if (data) {
                        var randomIndex = Math.floor(Math.random() * ($scope.count - 1));
                        data.color = $scope.colors[randomIndex].color;
                        $log.log(data);
                        temp.push(data);
                    }
                });
                return temp;
            };
            //$scope.category = [{ 'id':1, 'name':'死亡'},{'id':2, 'name':'重篤'},{'id':3, 'name':'非重篤'}];
            $scope.setCheckedDangerous = function (events) {
                var checkDangerous = $linq.Enumerable().From(events)
                    .Where(function (x) {
                        return x.checked === true;
                    })
                    .Select(function (x) {
                        return x.eventId;
                    })
                    .ToArray();
                return checkDangerous;
            };
            //initialize when this controller loads, load the application level data.
            $scope.categoryIdForDead = [];
            $scope.categoryIdForSerious = [];
            $scope.categoryIdForNonserious = [];
            //aggregate all the events of different kind to one array to track all checked ones.
            $scope.allEvents = [];
            $scope.putToAllEvents = function (menuTree) {
                var allEvents = [];
                angular.forEach(menuTree, function (data, index, array) {
                    angular.forEach(array[index].events, function (data) {
                        data.categoryId = array[index].categoryId;
                        allEvents.push(data);
                    });
                });
                return allEvents;
            };
            $scope.initialize = function () {
                if (!$rootScope.selectedCase) {
                    $location.path('/main');
                }
                //load application level data
                var applicationData = localStorageService.get(environmentSetting.sessionStorageKeys.applicationData);
                if (applicationData) {
                    $scope.applicationData = applicationData;

                    $scope.categoryIdForDead = $linq.Enumerable().From(applicationData.category)
                        .Where(function (x) {
                            return x.name === '死亡';
                        })
                        .Select(function (x) {
                            return x;
                        })
                        .ToArray();
                    $scope.categoryIdForSerious = $linq.Enumerable().From(applicationData.category)
                        .Where(function (x) {
                            return x.name === '重篤';
                        })
                        .Select(function (x) {
                            return x;
                        })
                        .ToArray();
                    $scope.categoryIdForNonserious = $linq.Enumerable().From(applicationData.category)
                        .Where(function (x) {
                            return x.name === '非重篤';
                        })
                        .Select(function (x) {
                            return x;
                        })
                        .ToArray();
                } else {
                    $log.log('Application data can not be found.');
                }
                //load case detail from api by $rootScope.selectedCase.id
                if ($rootScope.selectedCase) {
                    var data = {};
                    data.id = $rootScope.selectedCase.id;
                    mainService.getCaseDetail(data).then(function (result) {
                        $rootScope.selectedCase.result = result;
                        //put all kinds of events to one array
                        $scope.allEvents = $scope.putToAllEvents($rootScope.selectedCase.result.menuTree);
                        //set the default selected radio
                        $scope.querySeriousObject($rootScope.selectedCase.result.menuTree);
                        //set color generated to the events collection for the checkbox list
                        if ($scope.selectedSeriousObject.events) {
                            $scope.selectedSeriousObject.events = $scope.initializeColorForEvents($scope.selectedSeriousObject.events);
                            $log.log('events with color start');
                            $log.log($scope.selectedSeriousObject.events);
                            $log.log('events with color end');
                        }

                        //initialize the three dropdown selected items
                        var selectedDeadkey = $linq.Enumerable().From($rootScope.selectedCase.result.selected.death)
                            .Distinct()
                            .Select(function (x) {
                                return x;
                            })
                            .ToArray();
                        var selectedSeriouskey = $linq.Enumerable().From($rootScope.selectedCase.result.selected.serious)
                            .Distinct()
                            .Select(function (x) {
                                return x;
                            })
                            .ToArray();
                        var selectedNonseriouskey = $linq.Enumerable().From($rootScope.selectedCase.result.selected.notSerious)
                            .Distinct()
                            .Select(function (x) {
                                return x;
                            })
                            .ToArray();

                        $scope.selectedDead = $linq.Enumerable().From(applicationData.events)
                            .Where(function (x) {
                                return selectedDeadkey.indexOf(x.id) > -1;
                            })
                            .Distinct()
                            .Select(function (x) {
                                return x;
                            })
                            .ToArray();
                        $scope.selectedSerious = $linq.Enumerable().From(applicationData.events)
                            .Where(function (x) {
                                return selectedSeriouskey.indexOf(x.id) > -1;
                            })
                            .Distinct()
                            .Select(function (x) {
                                return x;
                            })
                            .ToArray();
                        $scope.selectedNonserious = $linq.Enumerable().From(applicationData.events)
                            .Where(function (x) {
                                return selectedNonseriouskey.indexOf(x.id) > -1;
                            })
                            .Distinct()
                            .Select(function (x) {
                                return x;
                            })
                            .ToArray();

                        $log.log('print selected data when first load start');
                        $log.log($scope.selectedDead);
                        $log.log($scope.selectedSerious);
                        $log.log($scope.selectedNonserious);
                        $log.log('print selected data when first load end');

                        $scope.selectedSeriousObject.checkedDangerous = $scope.setCheckedDangerous($scope.selectedSeriousObject.events);

                        $log.log('events with color start');
                        $log.log($scope.selectedSeriousObject.events);
                        $log.log('events with color end');

                        //monitor to analyze
                        $scope.$watch('$scope.selectedSeriousObject', function () {
                            if ($scope.selectedSeriousObject.checkedDangerous.length > 0) {
                                $scope.analyze();
                            }
                        });
                    });
                }

            };
            $scope.initialize();


            //openManageDataView
            $scope.openManageDataView = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'views/manageSeriousData.html',
                    controller: 'ManageCtrl',
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
            $scope.saveRelevantNumber = function () {
                var data = {};
                data.docId = $rootScope.selectedCase.result.documentId;
                data.userId = $rootScope.user.userId;
                data.relevantNum = $rootScope.selectedCase.result.releventNum;

                mainService.saveRelevantNumber(data).then(function (result) {
                    $ngConfirm({
                        title: '提示',
                        content: '相关番号保存成功.',
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
                    $log.log(result);
                }, function (response) {
                    $log.log('Error with status code', response.status);
                    $ngConfirm({
                        title: '提示',
                        content: '未成功，错误信息：' + response.status,
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
            };
            //define actions for the action button below the editor.
            $scope.done = function () {
                $log.log('done button clicked.');
                $scope.data = [];
                $scope.selectedDeadChanged();
                $scope.selectedSeriousChanged();
                $scope.selectedNonseriousChanged();
                $scope.checkDangerousChanged();

                $scope.mergeData($scope.selectedDeadToMerge);
                $scope.mergeData($scope.selectedSeriousToMerge);
                $scope.mergeData($scope.selectedNonseriousToMerge);
                $scope.mergeData($scope.checkDangerousToMerge);

                mainService.saveCase($scope.data).then(function (result) {
                    $ngConfirm({
                        title: '提示',
                        content: '保存成功.',
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
                    $log.log(result);
                }, function (response) {
                    $log.log('Error with status code', response.status);
                    $ngConfirm({
                        title: '提示',
                        content: '未成功，错误信息：' + response.status,
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
            };

            $scope.mergeData = function (objs) {
                angular.forEach(objs, function (data, index, array) {
                    $scope.data.push(array[index]);
                });
            };

            $scope.exit = function () {
                $log.log('exit button clicked.');
            };
            $scope.back = function () {
                $location.path('/main');
            };

            // for the three dropdown list, define selected values for each dropdown.
            $scope.selectedDeadToMerge = [];
            $scope.selectedSeriousToMerge = [];
            $scope.selectedNonseriousToMerge = [];
            $scope.checkDangerousToMerge = [];

            $scope.selectedDeadChanged = function () {
                $log.log('log dead dropdown data start');
                $log.log($scope.selectedDead);
                $log.log('log dead dropdown data end');
                $scope.selectedDeadToMerge = $linq.Enumerable().From($scope.selectedDead)
                    .Select(function (x) {
                        var node = {};
                        node.docId = $rootScope.selectedCase.id;
                        node.eventId = x.id;
                        node.categoryId = $scope.categoryIdForDead[0].id;
                        node.userId = $rootScope.user.userId;
                        node.aiFlag = 0;
                        return node;
                    })
                    .ToArray();

                $log.log('selectedDeadToMerge start');
                $log.log($scope.selectedDeadToMerge);
                $log.log('selectedDeadToMerge end');

            };


            $scope.selectedSeriousChanged = function () {
                $log.log('log Serious dropdown data start');
                $log.log($scope.selectedSerious);
                $log.log('log Serious dropdown data end');
                $scope.selectedSeriousToMerge = $linq.Enumerable().From($scope.selectedSerious)
                    .Select(function (x) {
                        var node = {};
                        node.docId = $rootScope.selectedCase.id;
                        node.eventId = x.id;
                        node.categoryId = $scope.categoryIdForSerious[0].id;
                        node.userId = $rootScope.user.userId;
                        node.aiFlag = 0;
                        return node;
                    })
                    .ToArray();
                $log.log('selectedSeriousToMerge start');
                $log.log($scope.selectedSeriousToMerge);
                $log.log('selectedSeriousToMerge end');
            };
            $scope.selectedNonseriousChanged = function () {
                $log.log('log Nonserious dropdown data start');
                $log.log($scope.selectedNonserious);
                $log.log('log  Nonseriousdropdown data end');
                $scope.selectedNonseriousToMerge = $linq.Enumerable().From($scope.selectedNonserious)
                    .Select(function (x) {
                        var node = {};
                        node.docId = $rootScope.selectedCase.id;
                        node.eventId = x.id;
                        node.categoryId = $scope.categoryIdForNonserious[0].id;
                        node.userId = $rootScope.user.userId;
                        node.aiFlag = 0;
                        return node;
                    })
                    .ToArray();
                $log.log('selectedSeriousToMerge start');
                $log.log($scope.selectedNonseriousToMerge);
                $log.log('selectedSeriousToMerge end');
            };

            //$scope.applicationData
            //TODO set the default checked object. 
            $scope.checkedObject = {
                checkedSeriousLevel: 1,
            };

            //get the serious object for the selected case.
            $scope.querySeriousObject = function (objs) {
                angular.forEach(objs, function (data, index, array) {
                    if (array.length > 0) {
                        $scope.selectedSeriousObject = array[0];
                        $scope.checkedObject.checkedSeriousLevel = $scope.selectedSeriousObject.categoryId;
                    }
                });
            };

            //event handler for 重笃性 radio list
            $scope.clickRadio = function (data) {
                $log.log(data);
                $scope.selectedSeriousObject = data;
                $log.log($scope.selectedSeriousObject);
                $log.log($scope.selectedSeriousObject.events);
                //$scope.checkDangerousChanged();
                $scope.initializeColorForEvents($scope.selectedSeriousObject.events);
                $scope.selectedSeriousObject.checkedDangerous = $scope.setCheckedDangerous($scope.selectedSeriousObject.events);
                $scope.$broadcast('analyzeTriggered', data);
            };
            //event hander for the checkbox list
            $scope.updateCheckedStateForEvents = function (checkedEventIds, uncheckedDangerousEvents) {

                angular.forEach($scope.allEvents, function (event, index) {
                    angular.forEach(checkedEventIds, function (checkedEventId) {
                        if (event.eventId === checkedEventId) {
                            $scope.allEvents[index].checked = true;
                        }
                    });
                });

                angular.forEach($scope.allEvents, function (event, index) {
                    angular.forEach(uncheckedDangerousEvents, function (uncheckedEventId) {
                        if (event.eventId === uncheckedEventId) {
                            $scope.allEvents[index].checked = false;
                        }
                    });
                });
            };
            $scope.getUncheckedEventIds = function (currentChildEvents, checkedEventIds) {
                var unckeckedEventIds = [];
                angular.forEach(currentChildEvents, function (event) {
                    unckeckedEventIds.push(event.eventId);
                });
                unckeckedEventIds = $linq.Enumerable().From(unckeckedEventIds)
                    .Where(function (x) {
                        return checkedEventIds.indexOf(x) === -1;
                    })
                    .Select(function (x) {
                        return x;
                    })
                    .ToArray();

                return unckeckedEventIds;
            };

            $scope.checkDangerousChanged = function (data) {
                $log.log('checked checkbox start');
                $log.log('node data passed:' + data);
                $log.log($scope.checkedObject.checkedSeriousLevel);
                $log.log($scope.selectedSeriousObject.checkedDangerous);
                $log.log('checked checkbox end');
                //update checked state with checkedDangerous.
                var uncheckedDangerousEvents = $scope.getUncheckedEventIds($scope.selectedSeriousObject.events, $scope.selectedSeriousObject.checkedDangerous);
                var checkedDangerousEvents = $scope.selectedSeriousObject.checkedDangerous;
                $scope.updateCheckedStateForEvents(checkedDangerousEvents, uncheckedDangerousEvents);
                $log.log('allEvents current status start');
                $log.log($scope.allEvents);
                $log.log('allEvents current status end');
                $scope.checkDangerousToMerge = $linq.Enumerable().From($scope.allEvents)
                    .Where(function (x) {
                        return x.checked === true;
                    })
                    .Select(function (x) {
                        var node = {};
                        node.docId = $rootScope.selectedCase.id;
                        node.eventId = x.eventId;
                        node.categoryId = x.categoryId;
                        node.userId = $rootScope.user.userId;
                        node.aiFlag = 1;
                        return node;
                    })
                    .ToArray();
                $log.log('checkDangerousToMerge start');
                $log.log($scope.checkDangerousToMerge);
                $log.log('checkDangerousToMerge end');
                $scope.$broadcast('analyzeTriggered', $scope.checkDangerousToMerge);
            };

            $scope.analyze = function () {
                if ($scope.selectedSeriousObject) {
                    //set background color for content
                    var events = $scope.selectedSeriousObject.events;
                    var checkedEventsId = $scope.selectedSeriousObject.checkedDangerous;
                    //set default color,below is a super method you could use to manipulate the dom
                    // angular.element(document).ready(function () {

                    // });
                    angular.forEach(events, function (data) {
                        var spans = angular.element(('.description-editor span'));
                        spans.css('background-color', 'transparent');
                        var tat = angular.element(('.' + data.eventId));
                        tat.css('background-color', 'transparent');
                    });
                    //if some checked,then set new color
                    if (checkedEventsId) {
                        var checkedEvents = $linq.Enumerable().From(events)
                            .Where(function (x) {
                                return checkedEventsId.indexOf(x.eventId) > -1;
                            })
                            .Select(function (x) {
                                return x;
                            })
                            .ToArray();


                        angular.forEach(checkedEvents, function (data) {
                            var tat = angular.element(('.' + data.eventId));
                            tat.css('background-color', data.color);
                        });
                    }
                }
            };

            $scope.$watch('$scope.selectedSeriousObject.checkedDangerous', function (n, o) {
                if (n === o) {
                }
                $scope.$broadcast('analyzeTriggered', n);
            });
            $scope.$on('analyzeTriggered', function (e, m) {
                $log.log('analyzeTriggered event triggered');
                $log.log('analyze start');
                $scope.analyze();
                $log.log(e + '' + m);
                $log.log('analyze end');
            });

            $rootScope.$on('onApplicationDataChanged', function () {
                //updata application data
                localStorageService.set(environmentSetting.sessionStorageKeys.applicationData, null);
                //reinitialize
                mainService.getApplicationData().then(function (result) {
                    localStorageService.set(environmentSetting.sessionStorageKeys.applicationData, result);
                    $scope.initialize();
                });  
            });
        }]).controller('ManageCtrl', ['$rootScope', '$scope', '$location', '$log', 'localStorageService', '$ngConfirm',
            'environmentSetting', '$uibModalInstance', 'mainService',
            function ($rootScope, $scope, $location, $log, localStorageService,
                $ngConfirm, environmentSetting, $uibModalInstance, mainService) {
                $scope.checkedCategory = {
                    checkedValue: 1,
                };

                $scope.initialize = function () {
                    var applicationData = localStorageService.get(environmentSetting.sessionStorageKeys.applicationData);
                    if (applicationData) {
                        $scope.category = applicationData.category;
                        $scope.checkedCategory.checkedValue = $scope.category[0].id;
                    }
                };
                $scope.initialize();
                $scope.changeCategory = function (item) {
                    $scope.checkedCategory.checkedValue = item.id;
                    $log.log('checkedCategory :' + $scope.checkedCategory);
                };
                $scope.seriousObjectText = '';
                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.submit = function () {
                    var data = {};
                    data.eventName = $scope.seriousObjectText;
                    data.userId = $rootScope.user.userId;
                    //TODO it is not meaningful for user to select one category
                    data.categoryId = $scope.checkedCategory.checkedValue;
                    mainService.saveSeriousObject(data).then(function (result) {
                        if (result) {

                        }
                        $rootScope.$broadcast('onApplicationDataChanged');
                        $ngConfirm({
                            title: '提示',
                            content: '保存成功.',
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
                            content: '保存失败：' + resp.status,
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
                };
            }]);

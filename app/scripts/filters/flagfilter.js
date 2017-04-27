'use strict';

/**
 * @ngdoc filter
 * @name YeoAngular.filter:flagFilter
 * @function
 * @description
 * # flagFilter
 * Filter in the YeoAngular.
 */
angular.module('YeoAngular')
  .filter('flagFilter', function () {
    return function (value) {
       var flagText = '';
        if(value === 0){
            flagText = '未判定';
        }
        if(value === 1){
            flagText = '判定中';
        }
        if(value === 2){
            flagText = '已判定';
        }
        return flagText;
    };
  });

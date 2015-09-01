'use strict';

/**
 * @ngdoc directive
 * @name progressTimerApp.directive:progressBar
 * @description
 * # progressBar
 */
angular.module('progressTimerApp')
  .directive('progressBar', function () {
    return {
      templateUrl: 'views/progressbar.html',
      restrict: 'E',
      controller: 'BarCtrl'
    };
  });

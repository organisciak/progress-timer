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
      controller: 'BarCtrl',
      link: function postLink(/*scope, element, attrs*/) {
        console.log("Bar link placeholder.");
        //element.text('this is the progressBar directive');
      }
    };
  });

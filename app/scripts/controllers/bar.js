'use strict';

/**
 * @ngdoc function
 * @name progressTimerApp.controller:BarCtrl
 * @description
 * # BarCtrl
 * Controller of the progressTimerApp
 */
angular.module('progressTimerApp')
  .controller('BarCtrl', function ($scope, $log) {
      // TODO rather than endless if/elses,
      // perhaps this.controller can be used to import
      // type-specific controller elements

      // Update schema, in case of older data
      if (typeof $scope.bar.running === 'undefined') {
        if ($scope.bar.type === 'timer' && $scope.bar.progress.start) {
          $scope.bar.running = true;
        } else if ($scope.bar.type === 'clock') {
          $scope.bar.running = true;
        } else {
          $scope.bar.running = false;
        }
      }

      // Update the progress percentile info
      var updatePercentile = function() {
        var percentile;
        var bar = $scope.bar;
        var current = (function() {
            if (bar.type === 'timer' && bar.progress.start) {
                return bar.current +
                    new Date().getTime() - bar.progress.start;
            } else {
                return bar.current;
            }
        })();
        
        var countUp = (bar.start < bar.end);

        if (current <= bar.start && countUp) {
           percentile = 0;
        }
        else if (current >= bar.end && countUp) {
            percentile = 100;
        }
        else if (current <= bar.end && !countUp) {
            percentile = 100;
        }
        else if (current >= bar.start && !countUp) {
            percentile = 0;
        } else {
            percentile = countUp ?
                100 * (current - bar.start) / (bar.end - bar.start) :
                100 * (bar.start - current) / (bar.start - bar.end);
        }
        if (percentile >= 100) {
          $scope.bar.running = false;
        }
        return $scope.bar.percentile = percentile;
        //$scope.bar.running = true;
      };

      //$scope.bar.running = true;

      updatePercentile();

  });

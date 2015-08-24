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

      // Update the progress percentile info
      var updatePercentile = function(bar) {
        if ($scope.bar.type == 'timer') {
          $scope.bar.percentile = 60;
        } else if ($scope.bar.type == 'counter') {
          $scope.bar.percentile = 100*(($scope.bar.current-$scope.bar.start)/
              ($scope.bar.end-$scope.bar.start));
        } else if ($scope.bar.type == 'clock') {
          $scope.bar.percentile = 10;
        } else {
          $log.error("No recognized type for percentile calculation.")
        }
      };

      updatePercentile();

  });

'use strict';

/**
 * @ngdoc function
 * @name progressTimerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the progressTimerApp
 */
angular.module('progressTimerApp')
  .controller('MainCtrl', 
  function ($http, $log, $scope, $rootScope, $interval, _) {
    var loadData, intervalTimer;
    var main = this;
    loadData = $http.get('diss-export.json');

    loadData.success(function(data) {
      main.data = data;
      $scope.bars = data.bars;
      $scope.$emit("prepareInterval");
    });


    
    // Count the types of bars and turn on (or off) the interval timer
    // that updated time-based bars
    $scope.$on("prepareInterval", function() {
      $log.debug("Setting time interval");
      // Find first time-based bar that is running
      var hasTime = _.find($scope.bars, function(bar) {
        if (bar.type === 'timer' || bar.type === 'clock') {
          return (bar.running || (bar.type === 'timer' && bar.progress.start));
        }
        return false;
      });
      if (hasTime && intervalTimer) {
        $log.debug("Nothing changed with intervals.");
      } else if (hasTime && !intervalTimer) {
        intervalTimer = $interval(function(){
          $scope.$broadcast('updateTemporal');
        }, 1000);
      } else if (intervalTimer) {
        $log.log('No time-based bars, cancelling timer');
        $interval.cancel(intervalTimer);
        intervalTimer = null;
      }
    });

    loadData.error(function(data, status) {
      console.error(status);
    });

  });

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
  function ($http, $log, $scope, $rootScope, $interval) {
    var loadData, intervalTimer;
    var main = this;
    loadData = $http.get('diss-export.json');

    loadData.success(function(data) {
      main.data = data;
      $scope.bars = data.bars;
      prepareInterval(data.bars);

    });
    
    // Count the types of bars and turn on (or off) the interval timer
    // that updated time-based bars
    var prepareInterval = function(bars) {
      // Find first time-based bar that is running
      var hasTime = _.find(bars, function(bar) {
        if (bar.type == 'timer' || bar.type == 'clock') {
          return (bar.running || (bar.type == 'timer' && bar.progress.start));
        }
        return false;
      });
      if (hasTime) {
        intervalTimer = $interval(function(){
          $scope.$broadcast('updateTemporal');
        }, 1000);
      } else if (intervalTimer) {
        $log.log('No time-based bars, cancelling timer');
        $interval.cancel(intervalTimer);
      }
    };

    loadData.error(function(data, status) {
      console.error(status);
    });

  });

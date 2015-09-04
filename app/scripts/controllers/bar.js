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
      $scope.debug = false;
      $scope.edit = false;
        
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

      // If clock or timer, watch for calls to update view
      // No point doing this for bars that only change with
      // user input
      if ($scope.bar.type === 'timer' || $scope.bar.type === 'clock') {
        $scope.$on("updateTemporal", function() {
              updatePercentile();
        });
      }

      $scope.toggleTimer = function() {
            if ($scope.bar.type !== 'timer') {
                  $log.warn("You can only toggle timers. How did you get here?");
                  return;
            }
            
            ($scope.bar.running ? stopTimer : startTimer)();
      };

      var stopTimer = function(){
        if ($scope.bar.progress.start) {
            $scope.bar.current = $scope.bar.current + (new Date()).getTime() - $scope.bar.progress.start;
        }
        $scope.bar.progress = { };
        $scope.bar.running = false;
        $scope.$emit("prepareInterval");
      };

      var startTimer = function() {
            var now = (new Date()).getTime();
            if ($scope.bar.progress.start) {
                  $log.error("Can't start the time when it is already running. Cycling to recover.");
                  stopTimer();
            }
            $scope.bar.progress = { start: now };
            $scope.bar.running = true;
            $scope.$emit("prepareInterval");
      };

      var resetTimer = function() {
            $scope.bar.current = 0;  
      };
      $scope.resetTimer = resetTimer;

      $scope.toggleEdit = function() {
            $scope.edit = !$scope.edit;
            if (bar.type === 'counter') {
                  updatePercentile();
            } else {
                  $scope.$emit("prepareInterval");   
            }
      };

      // Update the progress percentile info
      var updatePercentile = function() {
        var bar = $scope.bar;
        var current = (function() {
            if (bar.type === 'timer' && (bar.running || bar.progress.start)) {
                // To protect progress when the app is shut down
                // Temporary progress is saved to bar.progress
                var extraCurrent = 0;
                var now = (new Date()).getTime();
                if (bar.progress.start) {
                  extraCurrent = now - bar.progress.start;
                }
                if (bar.running) {
                  $scope.bar.progress = { start: now };
                }
                $scope.bar.current = bar.current + extraCurrent;
                return $scope.bar.current;
            } else if (bar.type === 'clock') {
                // Update current while we're at it
                $scope.bar.current = (new Date()).getTime();
                return $scope.bar.current;
            } else {
                return bar.current;
            }
        })();

        var countUp = (bar.start < bar.end);

        if (current < bar.start && countUp) {
           $scope.bar.percentile = 0;
           $scope.bar.overextend = true;
        }
        else if (current > bar.end && countUp) {
            $scope.bar.percentile = 100;
            $scope.bar.overextend = true;
        }
        else if (current < bar.end && !countUp) {
            $scope.bar.percentile = 100;
            $scope.bar.overextend = true;
        }
        else if (current > bar.start && !countUp) {
            $scope.bar.percentile = 0;
            $scope.bar.overextend = true;
        } else {
            $scope.bar.percentile = countUp ?
                100 * (current - bar.start) / (bar.end - bar.start) :
                100 * (bar.start - current) / (bar.start - bar.end);
            $scope.bar.overextend = false;
        }
      };

      updatePercentile();

  });

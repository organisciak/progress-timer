'use strict';

/**
 * @ngdoc service
 * @name progressTimerApp.msToTimeString
 * @description
 * # msToTimeString
 * Format milliseconds as string in format X Days H:MM:SS
 */
angular.module('progressTimerApp')
  .service('msToTimeString', function (msToTimeUnits) {
    return function(milliseconds){
        var time = msToTimeUnits(milliseconds);
        var timeStr;

        if (time.days > 0) { 
          timeStr = time.days + " day" + (time.days > 1 ? "s" : "");
        }
        if (time.hours > 0) {
          timeStr = timeStr + " " + time.hours + ":";
        }
        if (time.minutes > 0 || time.hours > 0) {
          timeStr = timeStr + _.padLeft(time.minutes, 2, "0") + ":";
        }
        if (time.days <= 0) {
          timeStr = timeStr + _.padLeft(time.seconds, 2, "0");
        }

        return timeStr;

    };

  });

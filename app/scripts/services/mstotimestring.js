'use strict';

/**
 * @ngdoc service
 * @name progressTimerApp.msToTimeString
 * @description
 * # msToTimeString
 * Format milliseconds as string in format X Days H:MM:SS
 */
angular.module('progressTimerApp')
  .service('msToTimeString', function (_, msToTimeUnits) {
    return function(milliseconds){
        var maxUnit = null;
        var time = msToTimeUnits(milliseconds);
        var timeStr = "";

        // Days
        if (time.days > 0) { 
          timeStr = time.days + " day" + (time.days > 1 ? "s" : "");
          if (time.hours || time.minutes || time.minutes) {
            timeStr = timeStr + " ";
          }
          maxUnit = 'd';
        }
        
        // Hours
        if (time.hours || (time.days && time.minutes)) {
          timeStr = timeStr + time.hours + ":";
          if (!maxUnit) {
            maxUnit = 'h';
          }
        }
        
        // Minutes
        if (time.minutes || time.hours) {
          if (maxUnit) {
            timeStr = timeStr + _.padLeft(time.minutes, 2, "0");
          } else {
            timeStr = time.minutes + "";
            maxUnit = 'm';
          }
        }

        // Seconds
        if (!time.days) {
          if (maxUnit) {
            timeStr = timeStr + ":" + _.padLeft(time.seconds, 2, "0");
          } else {
            timeStr = time.seconds + "";
             maxUnit = 's';
          }
          
        }

        return timeStr;

    };

  });

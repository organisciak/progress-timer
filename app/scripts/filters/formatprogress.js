'use strict';
/* globals moment, _ */

/**
 * @ngdoc filter
 * @name progressTimerApp.filter:formatProgress
 * @function
 * @description
 * # formatProgress
 * Filter in the progressTimerApp.
 */
angular.module('progressTimerApp')
  .filter('formatProgress', function (msToTimeString) {
    return function (input, type) {
      //Format text based on the bar type
        if (type === 'counter') {
            return input;
        } else if (type === 'clock') {
            return moment(input).format('lll');
        } else if (type === 'timer') {
            var time, timeStr = "";
            time = msToTimeString(input);
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
        } else {
            throw 'No valid bar type';
        }
    };
  });

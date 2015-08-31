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
            timeStr = msToTimeString(input);
            return timeStr;
        } else {
            throw 'No valid bar type';
        }
    };
  });

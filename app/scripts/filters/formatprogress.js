'use strict';
/* globals moment */

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
            return msToTimeString(input);
        } else {
            throw 'No valid bar type';
        }
    };
  });

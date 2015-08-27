'use strict';

/**
 * @ngdoc service
 * @name progressTimerApp.msToTimeString
 * @description
 * # msToTimeString
 * Format milliseconds as string in format X Days H:MM:SS
 */
angular.module('progressTimerApp')
  .service('msToTimeString', function () {
    return function(milliseconds){
      var days, hours, minutes, seconds;
      days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
      hours = Math.floor(milliseconds / (1000 * 60 * 60));
      minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
      seconds = Math.floor(milliseconds / (1000)) % 60;

      return {
          'days': days,
          'hours': hours,
          'minutes': minutes,
          'seconds': seconds
      };
    }

  });

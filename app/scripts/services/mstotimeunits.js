'use strict';

/**
 * @ngdoc service
 * @name progressTimerApp.msToTimeUnits
 * @description
 * # msToTimeUnits
 * Return days, hours, seconds, and minutes from millisecond value
 */
angular.module('progressTimerApp')
  .service('msToTimeUnits', function () {
     return function(milliseconds){
      if (typeof milliseconds !== "number") {
        throw new TypeError("Only numeric types can be string formatted")
      };

      var days, hours, minutes, seconds;
      days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
      hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
      minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
      seconds = Math.floor(milliseconds / (1000)) % 60;

      return {
          'days': days,
          'hours': hours,
          'minutes': minutes,
          'seconds': seconds
      };
    };
  });

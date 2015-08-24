'use strict';

/**
 * @ngdoc function
 * @name progressTimerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the progressTimerApp
 */
angular.module('progressTimerApp')
  .controller('MainCtrl', ['$http', '$log', '$scope', 
  function ($http, $log, $scope) {
    var loadData;
    var main = this;

    loadData = $http.get('diss-export.json');

    loadData.success(function(data) {
      main.data = data;
      $scope.bars = data.bars;

    });

    loadData.error(function(data, status, headers, config) {
      console.error(status);
    });

  }]);

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
    var loadData;
    var main = this;

    loadData = $http.get('diss-export.json');

    loadData.success(function(data) {
      main.data = data;
      $scope.bars = data.bars;

    });

    var interval = $interval(function(){
      $scope.$broadcast('updateTemporal');
    }, 1000);


    loadData.error(function(data, status) {
      console.error(status);
    });

  });

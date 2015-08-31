'use strict';

/**
 * @ngdoc overview
 * @name progressTimerApp
 * @description
 * # progressTimerApp
 *
 * Main module of the application.
 */
angular
  .module('progressTimerApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngRoute',
    'ngSanitize',
    'markdown',
    'ngTouch'
  ])
  // Make lodash injectable
  .constant('_', window._)
  // Config routes
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

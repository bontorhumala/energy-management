'use strict';

angular.module('rpm-web', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ui.calendar',
  'ui.router',
  'ngTable',
  'nvd3ChartDirectives',
  'wu.masonry',
  'leaflet-directive',
  'toggle-switch'
])
  .config(function ($routeProvider,$stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/dashboard");

    // Now set up the states
    $stateProvider
      .state('main', {
        url: "/dashboard",
        templateUrl: "views/main.html",
        controller: 'MainCtrl'
      })
      .state('supply', {
        url: "/supply",
        templateUrl: "views/supply.html",
        controller: 'SupCtrl'
      }) 
      .state('consumption', {
        url: "/consumption",
        templateUrl: "views/consumption.html",
        controller: 'ConsCtrl'       
      })
      .state('scheduling', {
        url: "/sched",
        templateUrl: "views/scheduling.html",
        controller: 'SchCtrl'       
      })      
      .state('alr', {
        url: "/alr",
        templateUrl: "views/alert.html",
        controller: 'AlrCtrl'       
      });      
  });

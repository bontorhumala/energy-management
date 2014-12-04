// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ui.bootstrap.datetimepicker', 'd3', 'starter.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.dashboard', {
      url: "/dashboard",
      views: {
        'menuContent' :{
          templateUrl: "templates/dashboard.html"
        }
      }
    })

    .state('app.energy', {
      url: "/energy",
      views: {
        'menuContent' :{
          templateUrl: "templates/energy.html"
        }
      }
    })
    .state('app.control', {
      url: "/control",
      views: {
        'menuContent' :{
          templateUrl: "templates/control.html",
          controller: 'ControlCtrl'
        }
      }
    })

    .state('app.schedule', {
      url: "/control/:controlId",
      views: {
        'menuContent' :{
          templateUrl: "templates/schedule.html",
          controller: 'ScheduleCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});

angular.module('d3', []);
angular.module('starter.directives', ['d3']);

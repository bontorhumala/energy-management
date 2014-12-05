// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'd3', 'starter.directives', 'angularChart', 'firebase'])
// ui.bootstrap.datetimepicker'
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

// setup an abstract state for the tabs directive
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html"
    })

    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'dashboard': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardCtrl'
        }
      }
    })
    .state('app.control', {
      url: '/control',
      views: {
        'control': {
          templateUrl: 'templates/control.html',
          controller: 'ControlCtrl'
        }
      }
    })
    .state('app.log', {
      url: '/log',
      views: {
        'log': {
          templateUrl: 'templates/log.html',
          controller: 'LogCtrl'
        }
      }
    })
    .state('app.environmental', {
      url: '/environmental',
      views: {
        'environmental': {
          templateUrl: 'templates/environmental.html',
          controller: 'EnvironmentalCtrl'
        }
      }
    })    
    .state('app.settings', {
      url: '/settings',
      views: {
        'settings': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
})

.factory('device', ['$http', function($http){
  var urlBase = 'http://api.thingspeak.com/channels/';
  var talkbackBase = 'http://api.thingspeak.com/talkback/';  
  var device = {};

  device.isdevice = '';

  // http://api.thingspeak.com/channels/(channel_id)/feed/last.(format)

  device.getFeedNow = function( items ) {
    var httpPromises = [];
    for (var i=0; i<items.length; i++) {
      httpPromises.push($http.get(urlBase + items[i].channelId + '/feed/last.json?offset=7&key=' + items[i].readKey ));
      console.log(urlBase + items[i].channelId + '/feed/last.json?offset=7&key=' + items[i].readKey);
    }
    return httpPromises;
  };

  device.getFeedLog = function(channelId, readKey, days, average) {
    // console.log(urlBase + channelId + '/feed.json?offset=7&key=' + readKey + '&days=' + days + '&average=' + average);
    var feedLog = $http.get(urlBase + channelId + '/feed.json?offset=7&key=' + readKey + '&days=' + days + '&average=' + average );
    // console.log(feedLog);
    return feedLog;
  }

  device.calculateOverview = function( data ) {
    // check isBase unit -> use as main power value
    // if isBaseMember -> do not add
    // else -> add
    var overviewValue = { 'power': '', 'voltage':'', 'current':'' }
    return overviewValue;
  }

  device.controlDevices = function( devices ) {
    var httpPromises = [];
    for (var i=0; i<devices.length; i++) {
      httpPromises.push($http.post(talkbackBase + devices[i].talkbackId + '/commands?api_key=' + devices[i].talkbackKey, devices[i].command));
    }
    return httpPromises;
  }

  function parseDate(inputDate) {
    // inputDate is ISO8601 format "2014-10-01T05:10:47.357918Z"
    return moment(inputDate).valueOf();
  }

  function mapToGraph(input, keyname) {
    var output = [];
    var timestamp;
    var value;
    input.map(function(obj) {
      Object.keys(obj).sort().map(function(key) {
        if (key == 'created_at') { timestamp = parseDate(obj[key]); }
        if (key == keyname) { value = parseFloat(obj[key]); }
      });
      output.push([timestamp, value]);
    });
    // console.log(output);
    return output;
  }

  device.getGraph = function(feedLog, keyname, graphname) {
    var graphData = [];
    var graphPoint = mapToGraph( feedLog, keyname );
    graphData.push( {"key": graphname, "values": graphPoint} );
    return graphData;
  }

  device.getFeed = function(channelId, readKey) {
    var feed = $http.get(urlBase + channelId + '/feed/last.json?offset=7&key=' + readKey );
    return feed;
  }

  return device;
}]);

angular.module('d3', []);
angular.module('starter.directives', ['d3']);

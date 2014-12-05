var app = angular.module('starter.controllers', [])

  app.controller('DashboardCtrl', function($scope, $rootScope, $ionicModal, $timeout, $templateCache, $http, $firebase, $q, device) {

    $scope.devices = [];

    var URL = "https://enerman.firebaseio.com/";
    // Synchronizing the devices on our $scope
    $scope.FireSites = $firebase(new Firebase(URL + '/devices')).$asArray();
    $scope.FireSites.$loaded().then(function() {
      $scope.FireSites.forEach(function(value, i) {
        // console.log(value);
        var item = { 'id':'', 'name':'', 'channelId':'', 'talkbackId':'', 'talkbackKey':'', 'writeKey':'', 'readKey':'', 'point':'', 'desc':'', 'type':'', 'command':''};
        item.id = value.id;
        item.name = value.name;
        item.channelId = value.channel;
        item.talkbackId = value.talkback;
        item.talkbackKey = value.talkbackKey;
        item.writeKey = value.writeKey;
        item.readKey = value.readKey;
        item.point = value.point;
        item.desc = value.desc;
        item.type = value.type;
        $scope.devices.push( item );
        $scope.getGraph();
        $scope.getOverview();
      });
      // console.log($scope.devices);
    });

    $scope.widgetval = { 'power':'', 'voltage':'', 'current':''};
    $scope.getOverview = function() {
      $scope.overviewPromise = device.getFeedNow( $scope.devices );
      // console.log($scope.overviewPromise);
      $q.all( $scope.overviewPromise ).then( function(results) {
        var data = [];
        angular.forEach(results, function(result) {
          data = data.concat(result.data);
        });
        $scope.widgetval = device.calculateOverview(data);
      })
    }

    $scope.getGraph = function () {
      $scope.graphPromise = device.getFeedLog($scope.devices[0].channelId, $scope.devices[0].readKey, 7, 15);
      $scope.graphPromise.then(function (data) {
        var feedData = data.data.feeds;
        $scope.powerData = device.getGraph(feedData, 'field1', "Power");
        // console.log($scope.voltData);
      });
    }

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };

    $scope.appliances = [
    ];

    $scope.numberOn = 0;
    $scope.numberOff = 0;  

    $scope.power = 0;
    $scope.voltage = 0;    
    $scope.current = 0;

    $scope.dataset = [
      {
        'day': '2013-01-02_00:00:00',
        'power': 1.05
      },
      {
        'day': '2013-01-02_01:00:00',
        'power': 1.25
      },
      {
        'day': '2013-01-02_02:00:00',
        'power': 1.71
      },           
      {
        'day': '2013-01-02_03:00:00',
        'power': 1.75
      },
      {
        'day': '2013-01-02_04:00:00',
        'power': 1.81
      },
      {
        'day': '2013-01-02_05:00:00',
        'power': 1.79
      },
      {
        'day': '2013-01-02_06:00:00',
        'power': 1.71
      },           
      {
        'day': '2013-01-02_07:00:00',
        'power': 1.73
      },
      {
        'day': '2013-01-02_08:00:00',
        'power': 1.55
      },
      {
        'day': '2013-01-02_09:00:00',
        'power': 1.65
      },
      {
        'day': '2013-01-02_10:00:00',
        'power': 1.52
      },           
      {
        'day': '2013-01-02_11:00:00',
        'power': 1.59
      },
      {
        'day': '2013-01-02_12:00:00',
        'power': 1.14
      },
      {
        'day': '2013-01-02_13:00:00',
        'power': 1.10
      },
      {
        'day': '2013-01-02_14:00:00',
        'power': 1.23
      },           
      {
        'day': '2013-01-02_15:00:00',
        'power': 1.29
      }

    ];

    $scope.schema = {
      day: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.options = {
      rows: [{
        key: 'power',
        type: 'bar',
        color:'goldenrod'
      }],
      xAxis: {
        key: 'day',
        displayFormat: '%H:%M',
        show:false,
      },
      subchart: {
        show: true,
      },
      yAxis: { 
        show: false,
      },
      zoom: {
        enable: true
      },
      legend: {
        show: false
      }
    };

    $scope.getCurrentVal = function() {
      $http({
        method: 'GET',
        url: "http://www.corsproxy.com/afternoon-cove-4361.herokuapp.com/acmd?",
        data: '' }).
      success(function(data, status) {
        // console.log("get current command val:");
        // console.log("data:" + data);
        $scope.numberOn = 0;
        $scope.numberOff = 0;
        $scope.appliances.forEach(function(entry, index) {
          if (data[index*2] == true) { entry.status = true; $scope.numberOn++; }
          else { entry.status = false; $scope.numberOff++; }
        });
        return data;
      }).
      error(function(data, status) {
        // console.log("data:" + data);
        return data;
      });

      $http({
        method: 'GET',
        url: "http://www.corsproxy.com/afternoon-cove-4361.herokuapp.com/meng?",
        data: '' }).
      success(function(data, status) {
        // console.log("get current energy val");
        // console.log("data:" + data);
        var parsed;
        parsed = data.split(",") 
        $scope.power = parsed[2];
        $scope.current = parsed[1];
        $scope.voltage = parsed[0];        
        // console.log("power: " + $scope.power)
        // console.log("current: " + $scope.current)        
        return data;
      }).
      error(function(data, status) {
        // console.log("get current energy val failed");
        // console.log("data:" + data);
        return data;
      });      
    }

    $scope.intervalFunction = function(){
      $timeout(function() {
        $scope.getCurrentVal();
        $scope.intervalFunction();
      }, 10000)
    };

    // Kick off the interval
    $scope.intervalFunction();

    $scope.sendAllCommand = function(status) {
      // console.log("allStatus:" + status);
      var requestParam = "http://www.corsproxy.com/afternoon-cove-4361.herokuapp.com/mcmd?"
      var requestVal = "";
      var command;
      if (status == true) {
        $scope.appliances.forEach(function(entry, index) {
          entry.status = true;
          $scope.numberOn = 10;
          $scope.numberOff = 0;
          if (entry.status == true) { command = 1; }
          else { command = 0; }
          requestVal += "c" + (index+1) + "=" + command +"&";          
        });
      }
      else {
        $scope.appliances.forEach(function(entry, index) {
          entry.status = false;
          $scope.numberOn = 0;
          $scope.numberOff = 10;
          if (entry.status == true) { command = 1; }
          else { command = 0; }
          requestVal += "c" + (index+1) + "=" + command +"&";          
        });      
      }
      // console.log(requestParam+requestVal);
      $http({
        method: 'GET',
        url: requestParam+requestVal,
        data: '' }).
      success(function(data, status) {
        // console.log("send command success");
        return data;
      }).
      error(function(data, status) {
        // console.log("send command failed");      
        return data;
      });      
    }

  })

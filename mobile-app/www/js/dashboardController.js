var app = angular.module('starter.controllers', [])

  app.controller('DashboardCtrl', function($scope, $rootScope, $ionicModal, $timeout, $templateCache, $http, $firebase, $q, device, mapDevice) {

    $scope.devices = mapDevice;   
    
    $scope.init = function () {
      $scope.getOverview();
      $scope.getGraph();
      $scope.updateState();      
    }

    $scope.widgetval = { 'power':'', 'voltage':'', 'current':''};

    $scope.getOverview = function() {
      $scope.overviewPromise = device.getFeedNow( $scope.devices );
      // console.log($scope.overviewPromise);
      $q.all( $scope.overviewPromise ).then( function(results) {
        var data = [];
        angular.forEach(results, function(result) {
          data = data.concat(result.data);
        });
        // console.log(data);
        $scope.widgetval.power = data[1].field1;
      })
    }

    $scope.powerData = [];

    $scope.getGraph = function () {
      $scope.graphPromise = device.getFeedLog($scope.devices[1].channelId, $scope.devices[1].readKey, 7, 15); // should be device 0
      $scope.graphPromise.then(function (data) {
        var feedData = data.data.feeds;
        // console.log(feedData);
        $scope.powerData = device.getGraph(feedData, 'field1', "Power");
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

    $scope.power = 0;
    $scope.voltage = 0;    
    $scope.current = 0;

    $scope.schema = {
      created_at: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.options = {
      rows: [{
        key: 'field1',
        type: 'bar',
        color:'goldenrod'
      }],
      xAxis: {
        key: 'created_at',
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

    $scope.intervalFunction = function(){
      $timeout(function() {
        $scope.updateState();
        $scope.intervalFunction();
      }, 10000)
    };

    // Kick off the interval
    $scope.intervalFunction();

    $scope.updateState = function() {
      $scope.statePromises = device.updateState($scope.devices);
      $q.all( $scope.statePromises ).then( function(results) {
        // console.log("updatePromise solved");
        // console.log(results);
        var data = [];
        angular.forEach(results, function(result) {
          data = data.concat(result.data);
        });
        var numberOn = 0;
        var numberOff = 0;
        for (var i=0; i<data.length; i++) {
          if ( data[i].length>1 ) {
            for (var j=0; j<data[i].length; j++) {
              if ( (data[i][j] == '&') && (data[i][j+1] == '&') ) {
                numberOn++;
              }
              else if ( (data[i][j] == '#') && (data[i][j+1] == '#') ) {
                numberOff++;
              }              
            }
          }
          else {
            if ( (data[i] == '&') && (data[i+1] == '&') ) {
              numberOn++;
            }
            else if ( (data[i] == '#') && (data[i+1] == '#') ) {
              numberOff++;
            }
          }
        }
        $scope.numberOn = numberOn;
        $scope.numberOff = numberOff;
      })
    }

    $scope.sendAllCommand = function(status) {
      // console.log("allStatus:" + status);
      for(var i=0; i<$scope.devices.length; i++) {
        if ($scope.devices[i].type == "plug") {
          if ( status == true ) {
            $scope.devices[i].command = "&&on";
          }
          else {
            $scope.devices[i].command = "##off";
          }
        }
        else if ($scope.devices[i].type == "panel") {
          var command = '';
          if ( status == true ) {
            for (var j=0; j<$scope.devices[i].point.length; j++) {
              command += "&&on";
            }
          }
          else {
            for (var j=0; j<$scope.devices[i].point.length; j++) {
              command += "##off";
            }
          }
          $scope.devices[i].command = command;          
        }
      }
      // console.log($scope.devices);
      $scope.controlPromise = device.controlDevices( $scope.devices );
      $q.all( $scope.controlPromise ).then( function(results) {
        console.log("controlPromise solved");
        $scope.updateState();
      })
    }

  })

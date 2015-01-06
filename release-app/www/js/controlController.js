var app = angular.module('starter')

  app.controller('ControlCtrl', function($scope, $timeout, $http, $firebase, $q, device, mapChannel, mapDevice) {

    $scope.channels = mapChannel;
    $scope.devices = mapDevice;

    $scope.getItemHeight = function(item, index) {
      //Make evenly indexed items be 10px taller, for the sake of example
      return (index % 2) === 0 ? 50 : 50;
    };

    $scope.intervalFunction = function(){
      $timeout(function() {
        $scope.intervalFunction();
        $scope.updateState();
      }, 5000)
    };

    // Kick off the interval
    $scope.intervalFunction();

    $scope.updateState = function() {
      $scope.statePromises = device.updateState($scope.devices);
      $q.all( $scope.statePromises ).then( function(results) {
        var data = [];
        angular.forEach(results, function(result) {
          data = data.concat(result.data);
        });
        // console.log(data);
        for (var i=0; i<data.length; i++) {
          if ( data[i].length>1 ) {
            for (var j=0; j<data[i].length; j++) {
              // console.log($scope.channels[i+j]);
              // console.log(data[i][j]);              
              if (data[i][j] == '1') {
                $scope.channels[i+j].status = true;
              }
              else if (data[i][j] == '0') {
                $scope.channels[i+j].status = false;
              }              
            }
          }
          else if ( data[0].length>1 ) {
            var offset = data[0].length - 1;
            if (data[i] == '1') {
              $scope.channels[i+offset].status = true;
            }
            else if (data[i] == '0') {
              $scope.channels[i+offset].status = false;
            }            
          }
          else {
            if (data[i] == '1') {
              $scope.channels[i].status = true;
            }
            else if (data[i] == '0') {
              $scope.channels[i].status = false;
            }
          }
        }
      })
    }

    $scope.sendCommand = function() {
      $scope.updateState();
      // console.log("sendCommand");
      for(var i=0; i<$scope.devices.length; i++) {
        if ($scope.devices[i].type == "panel") {
          var command = '';          
          for (var j=0; j<$scope.devices[i].point.length; j++)
          {
            if ( $scope.channels[i+j].status == true ) {
              command += '1';
            }
            else {
              command += '0';
            }
          } 
          $scope.devices[i].command = command;          
        }
        else if ($scope.devices[i].type == "plug") {
          if ( $scope.devices[i].status == true ) {
            $scope.devices[i].command = '1';
          }
          else {
            $scope.devices[i].command = '0';
          }
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

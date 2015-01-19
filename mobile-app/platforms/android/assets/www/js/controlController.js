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
      }, 10000)
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
        var it = 0;
        var offset = 0;        
        // console.log(data);
        for (var i=0; i<data.length; i++) {
          if ( data[i].length > 6 ) {
            for (var j=0; j<data[i].length; j++) {
              if ( (data[i][j] == '&') && (data[i][j+1] == '&') ) {
                $scope.channels[it].status = true;
                it++;
              }
              else if ( (data[i][j] == '#') && (data[i][j+1] == '#') ) {
                $scope.channels[it].status = false;
                it++;
              }
            }
          }
          else if ( data[i].length < 6 ) {
            if ( (data[i][0] == '&') && (data[i][1] == '&') ) {
              $scope.channels[it].status = true;
              it++;
            }
            else if ( (data[i][0] == '#') && (data[i][1] == '#') ) {
              $scope.channels[it].status = false;
              it++;
            }            
          }
          else {
            // console.log($scope.channels[it]);
            if ( (data[i][0] == '&') && (data[i][1] == '&') ) {
              $scope.channels[it].status = true;
              it++;
            }
            else if ( (data[i][0] == '#') && (data[i][1] == '#') ) {
              $scope.channels[it].status = false;
              it++;
            }
          }
        }
      })
    }

    $scope.sendCommand = function() {
      $scope.updateState();
      // console.log("sendCommand");
      var numPanel = 0;
      var numPlug = 0;      
      for(var i=0; i<$scope.devices.length; i++) {
        if ($scope.devices[i].type == "panel") {
          var command = '';
          numPanel++;
          for (var j=0; j<$scope.devices[i].point.length; j++)
          {
            if ( $scope.channels[i+j].status == true ) {
              command += "&&on";
            }
            else {
              command += "##off";
            }
          } 
          $scope.devices[i].command = command;          
        }
        else if ($scope.devices[i].type == "plug") {
          numPlug++;
          if ( $scope.channels[numPanel*8+numPlug-1].status == true ) {
            $scope.devices[i].command = "&&on";
          }
          else {
            $scope.devices[i].command = "##off";
          }
        }
      }
      // console.log($scope.devices);
      $scope.controlPromise = device.controlDevices( $scope.devices );
      $q.all( $scope.controlPromise ).then( function(results) {
        // console.log("controlPromise solved");
        $scope.updateState();
      })

    }

  })

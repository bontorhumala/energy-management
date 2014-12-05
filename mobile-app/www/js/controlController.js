var app = angular.module('starter')

  app.controller('ControlCtrl', function($scope, $timeout, $http) {
    // Form data for the login modal
    $scope.appliances = [
      { name: 'Air Conditioner 1', description: 'Living room', id: 1, status: false },
      { name: 'Air Conditioner 2', description: 'Bedroom', id: 2, status: false },
      { name: 'Lamp 1', description: 'Terrace',  id: 3, status: false },
      { name: 'Lamp 2', description: 'Living room',  id: 4, status: false },
      { name: 'Lamp 3',  description: '2nd floor', id: 5, status: false },
      { name: 'Lamp 4',  description: 'Kitchen', id: 6, status: false },    
      { name: 'Water heater',  description: 'Bathroom', id: 7, status: false },
      { name: 'Plug 1', description: 'Living room', id: 8, status: false },
      { name: 'Plug 2', description: 'Bedroom', id: 9, status: false },
      { name: 'Plug 3', description: 'Kitchen', id: 10, status: false }    
    ];

    $scope.getItemHeight = function(item, index) {
      //Make evenly indexed items be 10px taller, for the sake of example
      return (index % 2) === 0 ? 50 : 50;
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
    }

    $scope.intervalFunction = function(){
      $timeout(function() {
        $scope.getCurrentVal();
        $scope.intervalFunction();
      }, 10000)
    };

    // Kick off the interval
    $scope.intervalFunction();

    $scope.sendCommand = function(appIndex) {
      // console.log("appIndex: " + appIndex);
      // console.log("status:" + $scope.appliances[appIndex].status);
      var requestParam = "http://www.corsproxy.com/afternoon-cove-4361.herokuapp.com/mcmd?"
      var requestVal = "";
      var command;
      $scope.numberOn = 0;
      $scope.numberOff = 0;  
      $scope.appliances.forEach(function(entry, index) {
        // console.log(entry);
        if (entry.status == true) { command = 1; $scope.numberOn++; }
        else { command = 0; $scope.numberOff++; }
        requestVal += "c" + (index+1) + "=" + command +"&";      
      });
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

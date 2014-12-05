var app = angular.module('starter.controllers', [])

  app.config(['$httpProvider', function($httpProvider) {
      // $httpProvider.defaults.useXDomain = true;
      // $httpProvider.defaults.withCredentials = true;
      // delete $httpProvider.defaults.headers.common["X-Requested-With"];
      // $httpProvider.defaults.headers.common["Accept"] = "application/json";
      // $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    }
  ]);

  app.controller('DashboardCtrl', function($scope, $ionicModal, $timeout, $templateCache, $http) {
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

  app.controller('SettingCtrl', function($scope) {
    // Form data for the login modal
    $scope.appliances = [
      { name: 'Air Conditioner 1', id: 1, status: false },
      { name: 'Air Conditioner 2', id: 2, status: false },
      { name: 'Lamp 1', id: 3, status: false },
      { name: 'Lamp 2', id: 4, status: false },
      { name: 'Lamp 3', id: 5, status: false },
      { name: 'Lamp 4', id: 6, status: false },    
      { name: 'Water heater', id: 7, status: false },
      { name: 'Plug 1', id: 8, status: false },
      { name: 'Plug 2', id: 9, status: false },
      { name: 'Plug 3', id: 10, status: false }    
    ];

  })
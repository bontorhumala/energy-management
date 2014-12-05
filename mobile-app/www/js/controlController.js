var app = angular.module('starter')

  app.controller('ControlCtrl', function($scope, $timeout, $http, $firebase, $q, device) {

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
      });
      // console.log($scope.devices);
    });

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

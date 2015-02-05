var app = angular.module('starter')

  app.controller('EnvironmentalCtrl', function($scope, $firebase, device) {

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
      $scope.getGraph();
      // console.log($scope.devices);
    });

    $scope.temperatureData = [];
    $scope.humidityData = [];

    $scope.getGraph = function () {
      $scope.graphPromise = device.getFeedLog($scope.devices[0].channelId, $scope.devices[0].readKey, 7, 15); // should be device 0
      $scope.graphPromise.then(function (data) {
        var feedData = data.data.feeds;
        console.log(feedData);
        device.parseGraph(feedData);        
        $scope.temperatureData = device.getGraph(feedData, 'field5', "Temperature");
        $scope.humidityData = device.getGraph(feedData, 'field6', "Humidity");
      });
    }

    $scope.schemaHum = {
      created_at: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.optionsHum = {
      rows: [{
        key: 'field6',
        type: 'bar',
        color:'skyblue'
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

    $scope.schemaTemp = {
      created_at: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.optionsTemp = {
      rows: [{
        key: 'field5',
        type: 'bar',
        color:'salmon'
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

  })
var app = angular.module('starter')

  app.controller('LogCtrl', function($scope, $firebase, device) {

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
      $scope.getGraph();
    });

    $scope.powerData = [];
    $scope.voltageData = [];
    $scope.currentData = [];

    $scope.getGraph = function () {
      $scope.graphPromise = device.getFeedLog($scope.devices[1].channelId, $scope.devices[1].readKey, 7, 15); // should be device 0
      $scope.graphPromise.then(function (data) {
        var feedData = data.data.feeds;
        // console.log(feedData);
        $scope.powerData = device.getGraph(feedData, 'field1', "Power");
        // $scope.voltageData = device.getGraph(feedData, 'field2', "Voltage");
        // $scope.currentData = device.getGraph(feedData, 'field3', "Current");
      });
    }

    $scope.schemaVoltage = {
      day: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.optionsVoltage = {
      rows: [{
        key: 'field2',
        type: 'bar',
        color:'#ff8c69'
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

    $scope.schemaCurrent = {
      day: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.optionsCurrent = {
      rows: [{
        key: 'field3',
        type: 'bar',
        color:'#69ff8c'
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

    $scope.schemaPower = {
      day: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.optionsPower = {
      rows: [{
        key: 'field1',
        type: 'bar',
        color:'#8c69ff'
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
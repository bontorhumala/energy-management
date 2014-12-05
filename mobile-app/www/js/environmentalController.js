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
        $scope.getGraph();
      });
      // console.log($scope.devices);
    });

    $scope.getGraph = function () {
      $scope.graphPromise = device.getFeedLog($scope.devices[0].channelId, $scope.devices[0].readKey, 7, 15);
      $scope.graphPromise.then(function (data) {
        var feedData = data.data.feeds;
        $scope.temperatureData = device.getGraph(feedData, 'field5', "Temperature");
        $scope.humidityData = device.getGraph(feedData, 'field6', "Humidity");
        // console.log($scope.voltData);
      });
    }

    $scope.datasetHum = [
      {
        'day': '2013-01-02_00:00:00',
        'humidity': 1.05
      },
      {
        'day': '2013-01-02_01:00:00',
        'humidity': 1.25
      },
      {
        'day': '2013-01-02_02:00:00',
        'humidity': 1.71
      },           
      {
        'day': '2013-01-02_03:00:00',
        'humidity': 1.75
      },
      {
        'day': '2013-01-02_04:00:00',
        'humidity': 1.81
      },
      {
        'day': '2013-01-02_05:00:00',
        'humidity': 1.79
      },
      {
        'day': '2013-01-02_06:00:00',
        'humidity': 1.71
      },           
      {
        'day': '2013-01-02_07:00:00',
        'humidity': 1.73
      },
      {
        'day': '2013-01-02_08:00:00',
        'humidity': 1.55
      },
      {
        'day': '2013-01-02_09:00:00',
        'humidity': 1.65
      },
      {
        'day': '2013-01-02_10:00:00',
        'humidity': 1.52
      },           
      {
        'day': '2013-01-02_11:00:00',
        'humidity': 1.59
      },
      {
        'day': '2013-01-02_12:00:00',
        'humidity': 1.14
      },
      {
        'day': '2013-01-02_13:00:00',
        'humidity': 1.10
      },
      {
        'day': '2013-01-02_14:00:00',
        'humidity': 1.23
      },           
      {
        'day': '2013-01-02_15:00:00',
        'humidity': 1.29
      }
    ];

    $scope.schemaHum = {
      day: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.optionsHum = {
      rows: [{
        key: 'humidity',
        type: 'bar',
        color:'skyblue'
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

    $scope.datasetTemp = [
      {
        'day': '2013-01-02_00:00:00',
        'temperature': 1.05
      },
      {
        'day': '2013-01-02_01:00:00',
        'temperature': 1.25
      },
      {
        'day': '2013-01-02_02:00:00',
        'temperature': 1.71
      },           
      {
        'day': '2013-01-02_03:00:00',
        'temperature': 1.75
      },
      {
        'day': '2013-01-02_04:00:00',
        'temperature': 1.81
      },
      {
        'day': '2013-01-02_05:00:00',
        'temperature': 1.79
      },
      {
        'day': '2013-01-02_06:00:00',
        'temperature': 1.71
      },           
      {
        'day': '2013-01-02_07:00:00',
        'temperature': 1.73
      },
      {
        'day': '2013-01-02_08:00:00',
        'temperature': 1.55
      },
      {
        'day': '2013-01-02_09:00:00',
        'temperature': 1.65
      },
      {
        'day': '2013-01-02_10:00:00',
        'temperature': 1.52
      },           
      {
        'day': '2013-01-02_11:00:00',
        'temperature': 1.59
      },
      {
        'day': '2013-01-02_12:00:00',
        'temperature': 1.14
      },
      {
        'day': '2013-01-02_13:00:00',
        'temperature': 1.10
      },
      {
        'day': '2013-01-02_14:00:00',
        'temperature': 1.23
      },           
      {
        'day': '2013-01-02_15:00:00',
        'temperature': 1.29
      }

    ];

    $scope.schemaTemp = {
      day: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.optionsTemp = {
      rows: [{
        key: 'temperature',
        type: 'bar',
        color:'salmon'
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

  })
var app = angular.module('starter')

  app.controller('LogCtrl', function($scope, $firebase, device, mapDevice) {

    $scope.devices = mapDevice;

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
      created_at: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.optionsVoltage = {
      rows: [{
        key: 'field2',
        type: 'bar',
        color:'slategray'
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
      created_at: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.optionsCurrent = {
      rows: [{
        key: 'field3',
        type: 'bar',
        color:'slategray'
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
      created_at: {
        type: 'datetime',
        format: '%Y-%m-%d_%H:%M:%S',
        name: 'Date'
      }
    };

    $scope.optionsPower = {
      rows: [{
        key: 'field1',
        type: 'bar',
        color:'slategray'
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
var app = angular.module('starter')

  app.controller('EnvironmentalCtrl', function($scope) {
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
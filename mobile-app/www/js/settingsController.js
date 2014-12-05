var app = angular.module('starter')

  app.controller('SettingsCtrl', function($scope) {
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
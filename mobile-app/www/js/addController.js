var app = angular.module('starter')

  app.controller('AddCtrl', function($scope, $window, $state, $firebase, $q, $log) {

    var apname = '<' + $scope.apname + '>';
    var password = '(' + $scope.password + ')'

    var key = "";

    function onConnect(k) {
      $log.log('Established connection with ' + k);
      key = k;
      $window.tlantic.plugins.socket.isConnected( key, stub, stub );
      $window.tlantic.plugins.socket.send( stub, stub, key, '<' + $scope.apname + '>' );
      $window.tlantic.plugins.socket.send( stub, stub, key, '<' + $scope.password + '>' );      
    }

    function stub(d) {
      $log.log(d);
    }

    $scope.submitWiFi = function () {

      $window.tlantic.plugins.socket.connect( onConnect, stub, '192.168.4.1', 8888 );
      // $window.tlantic.plugins.socket.disconnect(stub, stub, key);        
      // $state.go('app.settings');
      $ionicLoading.show({ template: 'Devices added!', noBackdrop: true, duration: 2000 });
    }

  })

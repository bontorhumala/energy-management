var app = angular.module('starter')

  app.controller('AddCtrl', function($scope, $window, $state, $firebase, $q, $log, $timeout, $ionicLoading) {

    var key = "";

    $scope.accessPoint = {};

    function onConnect(k) {
      $log.log('Established connection with ' + k);
      key = k;
      // $window.tlantic.plugins.socket.isConnected( key, stub, stub );

      sendAP();
      $timeout( sendPassword, 3000 ).then( function() {
        $ionicLoading.show({ template: 'Devices added!', noBackdrop: true, duration: 2000 });
        // $timeout( $state.go('app.settings'), 3000 );
      });
    }

    function sendAP(){
      var apname = '<' + $scope.accessPoint.apname + '>';
      $log.log("sendAP: " + $scope.accessPoint.apname);      
      $window.tlantic.plugins.socket.send( apStub, apStub, key, apname );    
    }

    function sendPassword(){
      var password = '(' + $scope.accessPoint.password + ')';
      $log.log("sendPassword: " + $scope.accessPoint.password );      
      $window.tlantic.plugins.socket.send( passStub, passStub, key, password );
    }

    function stub(d) {
      $log.log(d);
    }

    function apStub(d) {
      $log.log(d);
    }

    function passStub(d) {
      $log.log(d);
    }

    $scope.submitWiFi = function () {
      $window.tlantic.plugins.socket.connect( onConnect, stub, '192.168.4.1', 8888 );
      // $window.tlantic.plugins.socket.disconnect(stub, stub, key);        
      // $state.go('app.settings');
    }

  })

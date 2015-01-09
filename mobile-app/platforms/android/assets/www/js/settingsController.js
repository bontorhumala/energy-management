var app = angular.module('starter')

  app.controller('SettingsCtrl', function($scope, $state, $firebase, $q, device, $log, $ionicLoading) {

    $scope.channels = [];
    $scope.devices = [];   

    $scope.setGeofence = function () {
      $state.go('geofences');
    }

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
        if (Array.isArray(item.point)) {
          for (var i=0; i< item.point.length; i++) {
            var channelItem = { 'id':'', 'name':'', 'channelId':'', 'talkbackId':'', 'talkbackKey':'', 'writeKey':'', 'readKey':'', 'point':'', 'desc':'', 'type':'', 'command':''};
            channelItem.id = item.id;
            channelItem.name = item.name;
            channelItem.channelId = item.channelId;            
            channelItem.talkbackId = item.talkbackId;
            channelItem.talkbackKey = item.talkbackKey;            
            channelItem.writeKey = item.writeKey;
            channelItem.readKey = item.readKey;
            channelItem.point = item.point[i];
            channelItem.desc = item.desc[i];                    
            channelItem.type = item.type;
            // console.log(channelItem);
            $scope.channels.push( channelItem );
          }
        }
        else {
          $scope.channels.push( item );
        }
      });
      // console.log($scope.devices);
    });

    $scope.submitSettings = function () {
      console.log($scope.devices);
      console.log($scope.channels);
      var numPanel = 0;
      var channelBase = 0;
      for (var i=0; i<$scope.FireSites.length; i++) {
        channelBase = numPanel * 8;
        if (Array.isArray($scope.FireSites[i].desc)) {
          for (var j=0; j<8; j++) {
            $scope.FireSites[i].point[j] = $scope.channels[channelBase+j].point;
            $scope.FireSites[i].desc[j] = $scope.channels[channelBase+j].desc;
            $scope.FireSites.$save(i);
          }
          numPanel++;
        }
        else {
          $scope.FireSites[i].point = $scope.channels[channelBase+i-1].point;
          $scope.FireSites[i].desc = $scope.channels[channelBase+i-1].desc;
          $scope.FireSites.$save(i);
        }
      }
      $log.log("settings submitted");
      $ionicLoading.show({ template: 'Changes confirmed!', noBackdrop: true, duration: 2000 });
    }

  })
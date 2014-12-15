var app = angular.module('starter')

  app.controller('SettingsCtrl', function($scope, $state, $firebase, $q, device) {

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

  })
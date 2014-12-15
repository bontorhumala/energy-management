var app = angular.module('starter')

app.controller('GeofencesCtrl', function ($scope, $ionicActionSheet, $timeout, $log, $state, geolocationService, geofenceService, $ionicLoading, $ionicActionSheet) {
    $ionicLoading.show({
        template: 'Getting geofences from device...'
    });

    $scope.geofences = [];
    geofenceService.getAll().then(function (geofences) {
        $scope.geofences = geofences;
        $ionicLoading.hide();
    });

    $scope.createNew = function () {
        $log.log('Obtaining current location...');
        $ionicLoading.show({
            template: 'Obtaining current location...'
        });
        geolocationService.getCurrentPosition()
            .then(function (position) {
                $log.log('Current location found');
                $ionicLoading.hide();
                //workaround ionic loading race condition
                $timeout(function () {
                    $ionicLoading.hide();
                }, 100);
                geofenceService.createdGeofenceDraft = {
                    id: UUIDjs.create().toString(),
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    radius: 1000,
                    transitionType: 1,
                    notification: {
                        id: geofenceService.getNextNotificationId(),
                        title: 'Ionic geofence example',
                        text: '',
                        openAppOnClick: true
                    }
                };
                geofenceService.createdGeofenceDraft.notification.data = angular.copy(geofenceService.createdGeofenceDraft);
                $state.go('geofence', {
                    geofenceId: geofenceService.createdGeofenceDraft.id
                });
            })
            .catch(function () {
                $log.log('Cannot obtain current locaiton');
                $ionicLoading.show({
                    template: 'Cannot obtain current location',
                    duration: 1500
                });
            });
    }

    $scope.editGeofence = function (geofence) {
        $state.go('geofence', {
            geofenceId: geofence.id
        });
    }

    $scope.removeGeofence = function (geofence) {
        geofenceService.remove(geofence);
    }

    $scope.more = function () {
        // Show the action sheet
        $ionicActionSheet.show({
            buttons: [
              { text: 'Save changes' },
              { text: 'Cancel' }              
            ],
            destructiveText: 'Delete all geofences',
            destructiveButtonClicked: function () {
                geofenceService.removeAll();
                return true;
            },
            buttonClicked: function(index) {
                $state.go("app.settings");
            }
        });
    }
})
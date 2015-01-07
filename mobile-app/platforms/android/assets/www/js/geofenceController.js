var app = angular.module('starter')

app.controller('GeofenceCtrl', function ($scope, $state, geofence, geofenceService, $log) {
    $scope.geofence = geofence;

    $scope.center = {
        lat: geofence.latitude,
        lng: geofence.longitude,
        zoom: 12
    };
    $scope.markers = {
        marker: {
            draggable: true,
            message: geofence.notification.text,
            lat: geofence.latitude,
            lng: geofence.longitude,
            icon: {}
        }
    };
    $scope.paths = {
        circle: {
            type: 'circle',
            radius: geofence.radius,
            latlngs: $scope.markers.marker,
            clickable: false
        }
    };

    $scope.isWhenGettingCloser = function () {
        return $scope.geofence.transitionType === 1;
    };

    $scope.chooseWhenIgetCloser = function () {
        $log.log("transitionType 1");
        $scope.geofence.transitionType = 1;
    };

    $scope.chooseWhenIamLeaving = function () {
        $log.log("transitionType 2");
        $scope.geofence.transitionType = 2;
    };

    $scope.save = function () {
        $scope.geofence.radius = parseInt($scope.paths.circle.radius);
        $scope.geofence.latitude = $scope.markers.marker.lat;
        $scope.geofence.longitude = $scope.markers.marker.lng;
        geofenceService.addOrUpdate($scope.geofence);
        $state.go('geofences');
    };
});
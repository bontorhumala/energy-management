'use strict';

angular.module('rpm-web')
.controller('IndexCtrl', function ($scope, $location, $http, $templateCache, $filter) {

    $scope.alertList = [
    {
      'pos' : 'left',
      'type' : 'warn',
      'desc' : 'Tegangan minimum',
      'due' : '13 hours ago',
    },
    {
      'pos' : 'right',
      'type' : 'fault',        
      'desc' : 'Tegangan turun',
      'due' : 'yesterday',
    },
    {
      'pos' : 'left',
      'type' : 'fault',
      'desc' : 'Listrik mati',
      'due' : 'a week ago',
    }
    ];

    //go
    $scope.go = function (path) {
      $location.url(path);
    };

    //date
    $scope.todayDate = {
      'day':'',
      'date':'',
      'month':'',
      'year':''
    };

    $scope.gettingDate = function(){
      var today = new Date();

      var weekday = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
      var dy = weekday[today.getDay()];

      var dd = today.getDate();
      var month = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
      var mm = month[today.getMonth()];
      var yyyy = today.getFullYear();

      if(dd<10){dd='0'+dd;}

      $scope.todayDate.day = dy;
      $scope.todayDate.date = dd;
      $scope.todayDate.month = mm;
      $scope.todayDate.year = yyyy;
      $scope.todayDate.monYear = mm + ' ' + yyyy;
    };
    //end date

    //init main
    $scope.initMain = function () {
      $scope.gettingDate();
    };
  });
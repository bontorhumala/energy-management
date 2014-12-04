'use strict';

angular.module('rpm-web')
.controller('SupCtrl', function ($scope, $location, $log, $templateCache, $filter, $modal) {                    

    $scope.widgetval = {
        'active':'59',
        'inactive':'52',
    }; 

    $scope.open = function(id) {
      var modalInstance = $modal.open({
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl',
        id: id,
        resolve: {
          id: function () {
            return id;
          },          
          item: function () {
            return $scope.items[id];
          }
        }
      });

      modalInstance.result.then(function () {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };   

    $scope.items = [
      {
        'name': '101',
        'status': 'true',
      },
      {
        'name': '102',
        'status': 'true',        
      },
      {
        'name': '103',
        'status': 'false',
      },
      {
        'name': '104',
        'status': 'true',
      },
      {
        'name': '105',
        'status': 'false',
      },
      {
        'name': '106',
        'status': 'true',
      },      
      {
        'name': '107',
        'status': 'false',
      },
      {
        'name': '108',
        'status': 'true',
      },
      {
        'name': '109',
        'status': 'true',
      },
      {
        'name': '110',
        'status': 'false',
      },
      {
        'name': '201',
        'status': 'false',
      },
      {
        'name': '202',
        'status': 'true',
      },
      {
        'name': '203',
        'status': 'true',
      },
      {
        'name': '204',
        'status': 'true',
      }      
    ];

});

angular.module('rpm-web').controller('DetailCtrl', function ($scope, $modalInstance, id, item) {

  $scope.id = id;
  $scope.item = item;  

  $scope.detailData = [
  {
    "key": "Aktif",
    "values": [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] , [ 1030766400000 , -5.9507873460847] , [ 1033358400000 , -11.569146943813] , [ 1036040400000 , -5.4767332317425] , [ 1038632400000 , 0.50794682203014] , [ 1041310800000 , -5.5310285460542] , [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] , [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] , [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] ]
  },
  {
    "key": "Inaktif",
    "values": [ [ 1025409600000 , -7.0674410638835] , [ 1028088000000 , -14.663359292964] , [ 1030766400000 , -14.104393060540] , [ 1033358400000 , -23.114477037218] , [ 1036040400000 , -16.774256687841] , [ 1038632400000 , -11.902028464000] , [ 1041310800000 , -16.883038668422] , [ 1043989200000 , -19.104223676831] , [ 1046408400000 , -20.420523282736] , [ 1049086800000 , -19.660555051587] , [ 1051675200000 , -13.106911231646] , [ 1054353600000 , -8.2448460302143] , [ 1056945600000 , -7.0313058730976] ]
  }];

  $scope.xAxisTickFormatFunction = function(){
   return function(d){
      return d3.time.format('%d/%m')(new Date(d));  //uncomment for date format
    }
  }

  $scope.close = function () {
    $modalInstance.close();
  };
});

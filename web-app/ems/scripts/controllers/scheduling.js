'use strict';

angular.module('rpm-web')
.controller('SchCtrl', function ($scope, $location, $log, $templateCache, $q, $filter, $modal, ngTableParams) {                    

    $scope.widgetval = {
        'active':'59',
        'inactive':'52',
        'scheduled':'100',
    };

    $scope.open = function(id) {
      var modalInstance = $modal.open({
        templateUrl: 'views/arrange.html',
        controller: 'ArrangeCtrl',
        id: id,
        resolve: {
          id: function () {
            return id;
          },
          item: function () {
            return data[id];
          }
        }
      });

      modalInstance.result.then(function () {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };   

    var data = [
      {
        'id': 0,
        'name': '101',
        'status': 'true',
      },
      {
        'id': 1,
        'name': '102',
        'status': 'true',        
      },
      {
        'id': 2,        
        'name': '103',
        'status': 'false',
      },
      {
        'id': 3,        
        'name': '104',
        'status': 'true',
      },
      {
        'id': 4,        
        'name': '105',
        'status': 'false',
      },
      {
        'id': 5,
        'name': '106',
        'status': 'true',
      },      
      {
        'id': 6,
        'name': '107',
        'status': 'false',
      },
      {
        'id': 7,
        'name': '108',
        'status': 'true',
      },
      {
        'id': 8,
        'name': '109',
        'status': 'true',
      },
      {
        'id': 9,
        'name': '110',
        'status': 'false',
      },
      {
        'id': 10,
        'name': '201',
        'status': 'false',
      },
      {
        'id': 11,
        'name': '202',
        'status': 'true',
      },
      {
        'id': 12,
        'name': '203',
        'status': 'true',
      },
      {
        'id': 13,
        'name': '204',
        'status': 'true',
      }      
    ];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,           // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {

          var orderedData = params.sorting() ?
          $filter('orderBy')(data, params.orderBy()) : data;
          orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;

          params.total(orderedData.length); // set total for recalc pagination
          $scope.allFiltered = orderedData;
          $defer.resolve($scope.filtered = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    var inArray = Array.prototype.indexOf ?
            function (val, arr) {
                return arr.indexOf(val)
            } :
            function (val, arr) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] === val) return i;
                }
                return -1
            };

    $scope.names = function(column) {
        var def = $q.defer(),
            arr = [],
            names = [];
        angular.forEach(data, function(item){
            if (inArray(item.name, arr) === -1) {
                arr.push(item.name);
                names.push({
                    'id': item.name,
                    'title': item.name
                });
            }
        });
        def.resolve(names);
        return def;
    };

    $scope.checkboxes = { 'checked': false, items: {} };

    // watch for check all checkbox
    $scope.$watch('checkboxes.checked', function(value) {
        angular.forEach($scope.allFiltered, function(item) {
            if (angular.isDefined(item.id)) {
                $scope.checkboxes.items[item.id] = value;
            }
        });
    });

    // watch for data checkboxes
    $scope.$watch('checkboxes.items', function(values) {
        if (!data) {
            return;
        }
        var checked = 0, unchecked = 0,
            total = data.length;
        angular.forEach(data, function(item) {
            checked   +=  ($scope.checkboxes.items[item.id]) || 0;
            unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        // grayed checkbox
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);

});

angular.module('rpm-web').controller('ArrangeCtrl', function ($scope, $modalInstance, id, item) {

  $scope.id = id;
  $scope.item = item;

  $scope.schedules = [
    {
      'day': 'Senin',
    },
    {
      'day': 'Selasa',
    },
    {
      'day': 'Rabu',
    },
    {
      'day': 'Kamis',
    },  
    {
      'day': 'Jumat',
    },
    {
      'day': 'Sabtu',
    },
    {
      'day': 'Minggu',
    }
  ];

  $scope.close = function () {
    $modalInstance.close();
  };
});

angular.module('rpm-web').directive('timePicker', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@',
          },
        link: function ($scope, element, attrs) { 
          var r = new RangeBar({
            min: moment([2007, 0, 29, 0, 0]),
            max: moment([2007, 0, 30, 0, 0]),
            valueFormat: function(ts) {
              return moment(ts).format('HH:mm');
            },
            valueParse: function(date) {
              return moment(date).valueOf();
            },
            label: function(a){
              var start = moment.duration(a[0], 'HH:mm');
              var end = moment.duration(a[1], 'HH:mm');
              console.log("start: " + start);
              console.log("end: " + end);
              if (end == 0) { end = moment.duration('23:59', 'HH:mm'); }
              return end.subtract(start).humanize();
            },
            snap: 1000 * 60 * 15,
            minSize: 500 * 60 * 60,
            barClass: 'progress',
            rangeClass: 'bar',
            maxRanges: 3,
            bgLabels: 12,
            allowDelete: true,
            deleteTimeout: 1500
          });

          angular.element(element).prepend(r.$el);
        } //DOM manipulation
    };
});
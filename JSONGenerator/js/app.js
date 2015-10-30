// JavaScript Document
var firstapp = angular.module('firstapp', [
  'ngRoute',
  'phonecatControllers',
  'templateservicemod',
  'navigationservice'
]);

firstapp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/home', {
      templateUrl: 'views/template.html',
      controller: 'home'
    }).
    when('/models', {
      templateUrl: 'views/template.html',
      controller: 'models'
    }).
    otherwise({
      redirectTo: '/home'
    });
  }
]);

firstapp.directive('array', function() {
    return {
        restrict: 'EA',
        scope: {
            GalleryStructure: "=objval",
            EditVal: "=editval",
            ModelObj: "=modelobj"
        },
        replace: false,
        templateUrl: "views/directive/array.html",
        link: function($scope, element, attr) {
            var GalleryStructure = $scope.GalleryStructure;
            var EditVal = $scope.EditVal;
            $scope.label = attr.label;
            $scope.GalleryStrucObj = {};
            $scope.GalleryStrucObj.keyOf = [];
            $scope.keyOfArr = _.pluck(GalleryStructure, "name");
            _.each($scope.keyOfArr, function(n) {
                $scope.GalleryStrucObj.keyOf.push(_.camelCase(n).toLowerCase());
            });
            $scope.GalleryStrucObj.structure = GalleryStructure;
            $scope.GalleryStrucObj.valuesOf = [];
            $scope.GalleryStrucObj.valuesOf = EditVal;
            $scope.GalleryStrucObj.nullObj = {};
            _.each($scope.GalleryStrucObj.keyOf, function(n, key) {
                $scope.GalleryStrucObj.nullObj[n] = "";
            });
            $scope.GalleryStrucObj.add = function() {
                $scope.GalleryStrucObj.valuesOf.push(_.clone($scope.GalleryStrucObj.nullObj, true));
            };
            $scope.GalleryStrucObj.remove = function(obj) {
                var objkey = _.remove($scope.GalleryStrucObj.valuesOf, obj);
            };
            $scope.EditVal = $scope.GalleryStrucObj.valuesOf;
        }
    }
});
firstapp.directive('createovalidation', function() {
  return {
    restrict: 'EA',
    replace: false,
    link: function($scope, element, attr) {
      $element = $(element);
      var validation = $scope[attr.createovalidation].structure[attr.objkey].validation;
      _.each(validation, function(n) {
        var m = n.split("=");
        if (!m[1]) {
          m[1] = "";
        }
        $element.attr(m[0], m[1]);
      });
    }
  }
});

firstapp.filter('converttime', function(FireBaseServices) {
  return function(input) {
    input = parseInt(input);
    var date = new Date(input);
    return date.toUTCString();
  };
});

firstapp.filter("jsonparse", function() {
  return function(input) {
    return angular.toJson(input, pretty);;
  }
})

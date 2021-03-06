// Modules
var weatherApp = angular.module("weatherApp", ['ngRoute', 'ngResource']);

// Routes
weatherApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    })
    .when('/forecast/', {
        templateUrl: 'pages/forecast.html',
        controller: 'forecastController'
    })
    .when('/forecast/:days', {
        templateUrl: 'pages/forecast.html',
        controller: 'forecastController'
    })
    .otherwise({
        redirectTo:'/'
    })
});

// Controllers
weatherApp.controller('homeController', ["$scope", "$location", "cityService", function($scope, $location, cityService) {
    $scope.city = cityService.city;
    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    })
//    $scope.getLink = function() {
//        return "#/forecast/" + $scope.city;
//    }
    $scope.submit = function() {
          $location.path("/forecast");
    };
}]);
weatherApp.controller('forecastController', ["$scope", "$routeParams", "$resource", "cityService", function($scope, $routeParams, $resource, cityService) {
    $scope.city = cityService.city;
    
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {callback: "JSON_CALLBACK"}, {get: {method: "JSONP"}});
    
    $scope.days = $routeParams.days || '2';
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, 
                                                  cnt:$scope.days, 
                                                  appid:'bd82977b86bf27fb59a04b61b657fb6f' })
//    console.log($scope.weatherResult);

    $scope.convertToFarenheit = function(degK) {
//        return Math.round((1.8 * (degK - 273)) + 32);
        return Math.round(degK - 273);
    }
    
    $scope.convertToDate = function(dt) {
        return new Date(dt * 1000);
    }
}]);


// Services
weatherApp.service("cityService", function() {
    var self = this;
    this.city = 'Buffalo, NY'
//    this.updateCity = function(newCity) {
//        self.city = newCity;
//    }
})

// Directives
weatherApp.directive('temperaturePanel', function() {
   return {
       templateUrl: 'directives/weatherReport.html',
       replace: true,
       scope: {
           weatherDay: '=',
           convertToDate: '&',
           convertToFarenheit: '&'
       }
   } 
});

console.log("working fine :)...")
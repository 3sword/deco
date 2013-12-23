'use strict';

var decoApp = angular.module('decoApp',[
  'ngRoute',
  'ngCookies',
  'restangular',
  'decoControllers',
  'decoServices',
  'decoFilters'
  ]);

decoApp.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/login', {
    templateUrl : 'login.html',
    controller : 'LoginCtrl'
  });
  $routeProvider.when('/home', {
    templateUrl : 'partials/home.html',
    controller : 'HomeCtrl'
  });
  $routeProvider.when('/my_daily_reports/:date', {
    templateUrl : 'partials/daily_report.html',
    controller : 'DailyReportCtrl'
  });
  $routeProvider.otherwise({
    redirectTo : '/home'
  });

} ).config( function(RestangularProvider) {
  RestangularProvider.setBaseUrl('api');
} ).config(function ($httpProvider) {

  var logsOutUserOn401 = ['$q', '$location', function ($q, $location) {
    var success = function (response) {
      return response;
    };

    var error = function (response) {
      if (response.status === 401) {
        //redirect them back to login page
        $location.path('/login');

        return $q.reject(response);
      }
      else {
        return $q.reject(response);
      }
    };

    return function (promise) {
      return promise.then(success, error);
    };
  }];

  $httpProvider.responseInterceptors.push(logsOutUserOn401);
});

decoApp.run(function ($rootScope, $location, AuthenticationService) {

  // enumerate routes that don't need authentication
  var routesThatDontRequireAuth = ['/login'];

  // check if current location matches route
  var routeClean = function (route) {
    return _.find(routesThatDontRequireAuth,
      function (noAuthRoute) {
        return _.str.startsWith(route, noAuthRoute);
      });
  };

  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    // if route requires auth and user is not logged in
    if (!routeClean($location.url()) && !AuthenticationService.isLoggedIn()) {
      // redirect back to login
      $location.path('/login');
    }
  });
});

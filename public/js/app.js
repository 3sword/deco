'use strict';

var decoApp = angular.module('decoApp',[
  'ngRoute',
  'ngCookies',
  'ngSanitize',
  'restangular',
  'decoControllers',
  'decoServices',
  'decoDirectives',
  'decoFilters',
  'ui.bootstrap'
  ]);

decoApp.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/login', {
    templateUrl : 'login.html',
    controller : 'LoginCtrl'
  });
  $routeProvider.when('/signup', {
    templateUrl : 'signup.html',
    controller : 'SignupCtrl'
  });
  $routeProvider.when('/home', {
    templateUrl : 'partials/home.html',
    controller : 'HomeCtrl'
  });
  $routeProvider.when('/my_daily_reports/:date', {
    templateUrl : 'partials/daily_report.html',
    controller : 'DailyReportCtrl'
  });
  $routeProvider.when('/published_daily_reports/:username/:date', {
    templateUrl : 'partials/daily_report.html',
    controller : 'DailyReportCtrl'
  });
  $routeProvider.when('/report_list', {
    templateUrl : 'partials/report_list.html',
    controller : 'ReportListCtrl'
  });
  $routeProvider.when('/user', {
    templateUrl : 'partials/user.html',
    controller: 'UserCtrl'
  });
  $routeProvider.when('/groups', {
    templateUrl : 'partials/groups.html',
    controller: 'GroupsCtrl'
  });
  $routeProvider.when('/groups/:group/settings', {
    templateUrl : 'partials/group_settings.html',
    controller: 'GroupSettingsCtrl'
  });
  $routeProvider.when('/add_group', {
    templateUrl : 'partials/add_group.html',
    controller: 'AddGroupCtrl'
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
  var routesThatDontRequireAuth = ['/login', '/signup'];

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

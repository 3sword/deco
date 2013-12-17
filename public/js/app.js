'use strict';

var decoApp = angular.module('decoApp',[
    'ngRoute',
    'restangular',
    'decoControllers',
    'decoServices',
    'decoFilters'
    ]);

decoApp.config([ '$routeProvider', function($routeProvider) {
    $routeProvider.when('/employees', {
        templateUrl : 'partials/employees.html',
        controller : 'EmployeeListCtrl'
    });
    $routeProvider.when('/employees/:id', {
        templateUrl : 'partials/employee.html',
        controller : 'EmployeeDetailCtrl'
    });
    $routeProvider.when('/new-employee', {
        templateUrl : 'partials/employee.html',
        controller : 'UserCreationCtrl'
    });
    $routeProvider.otherwise({
        redirectTo : '/employees'
    });
} ]).config([ 'RestangularProvider', function(RestangularProvider) {
    RestangularProvider.setBaseUrl('rest');
} ]);

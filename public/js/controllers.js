'use strict';

/* Controllers */
angular.module('myApp.controllers', []);

angular.module('myApp.controllers', []).controller('EmployeeListCtrl', [ '$scope', '$location', 'Restangular', function($scope, $location, Restangular) {

    // callback for ng-click 'editEmployee':
    $scope.editEmployee = function(employeeId) {
        $location.path('/employees/' + employeeId);
    };

    // callback for ng-click 'deleteEmployee':
    $scope.deleteEmployee = function(employeeId) {
        Restangular.one('employees', employeeId).remove().then(function() {
            Restangular.all('employees').getList().then(function(employees) {
                $scope.employees = employees;
            });
        });
    };

    // callback for ng-click 'createEmployee':
    $scope.createNewEmployee = function() {
        $location.path('/new-employee');
    };

    Restangular.all('employees').getList().then(function(employees) {
        $scope.employees = employees;
    });

} ]).controller('EmployeeDetailCtrl', [ '$scope', '$routeParams', '$location', 'Restangular', function($scope, $routeParams, $location, Restangular) {
    // callback for ng-click 'updateUser':
    $scope.updateEmployee = function() {
        $scope.employee.put().then(function() {
            $location.path('/employees');
        });
    };

    // callback for ng-click 'cancel':
    $scope.cancel = function() {
        $location.path('/employees');
    };
    Restangular.one('employees', $routeParams.id).get().then(function(data) {
        $scope.employee = data;
    });
} ]).controller('UserCreationCtrl', [ '$scope', '$location', 'Restangular', function($scope, $location, Restangular) {
    $scope.cancel = function() {
        $location.path('/employees');
    };
    // callback for ng-click 'createNewUser':
    $scope.createNewEmployee = function() {
        Restangular.all('employees').post($scope.employee).then(function(data) {
            console.log(data);
            $location.path('/employees');
        });
    }
} ]);
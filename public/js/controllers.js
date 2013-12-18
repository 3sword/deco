'use strict';

/* Controllers */
var decoControllers = angular.module('decoControllers', []);

decoControllers.controller('LoginCtrl', ['$scope', 'Restangular', 'AuthenticationService', function($scope, Restangular, AuthenticationService) {
    $scope.loginHint = '';
    $scope.loginName = '';
    $scope.loginPassword = '';


    $scope.tryLogin = function(ev) {
        if (ev.which != 13) {
            return;
        }

        var data = {'username': $scope.loginName,
                    'password': $scope.loginPassword};

        console.log(data);
        Restangular.all('login').post(data).then(function(){
            AuthenticationService.setLoginStatus(true);
        }, function(response){
            AuthenticationService.setLoginStatus(false);
        });
    };
}]);

/*decoControllers.controller('EmployeeListCtrl', [ '$scope', '$location', 'Restangular', function($scope, $location, Restangular) {

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
} ]);*/
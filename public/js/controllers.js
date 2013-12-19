'use strict';

/* Controllers */
var decoControllers = angular.module('decoControllers', []);

decoControllers.controller('LoginCtrl', function($scope, Restangular, AuthenticationService, $location) {
    $scope.loginHint = '';
    $scope.loginName = '';
    $scope.loginPassword = '';


    $scope.tryLogin = function(ev) {
        if (ev.which != 13) {
            return;
        }

        var data = {'username': $scope.loginName,
                    'password': $scope.loginPassword};

        Restangular.all('login').post(data).then(function(data){
            AuthenticationService.setUserName(data);
            $location.path('/home');
        }, function(response){
            AuthenticationService.setUserName("");
        });
    };
});

decoControllers.controller('HeadCtrl', function($scope, AuthenticationService) {
    $scope.$watch(function () { return AuthenticationService.getUserName(); }, function(username) {
        if (!!username){
            $scope.message = "Welcome, " + username + "!";
        } else{
            $scope.message = "";
        }
    });
});

decoControllers.controller('HomeCtrl', function($scope, Restangular) {
    $scope.reportStatus = Restangular.one('daily_reports/today/status').get();
});
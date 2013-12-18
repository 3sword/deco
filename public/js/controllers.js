'use strict';

/* Controllers */
var decoControllers = angular.module('decoControllers', []);

decoControllers.controller('LoginCtrl', function($scope, Restangular, AuthenticationService) {
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
});

decoControllers.controller('HeadCtrl', function($scope, AuthenticationService) {
    $scope.message = "";
    if (AuthenticationService.isLoggedIn()) {
        $scope.message = "Welcome, " + AuthenticationService.getUserName();
    }
});

decoControllers.controller('HomeCtrl', function($scope, Restangular) {
    $scope.reportStatus = Restangular.one('daily_reports/today/status').get();
});
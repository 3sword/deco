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
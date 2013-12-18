'use strict';

/* Services */

var decoServices = angular.module('decoServices', []);

decoServices.service('AuthenticationService',function(Restangular, $cookieStore){

    var loginStatus;

    this.isLoggedIn = function() {
        return loginStatus;
    }

    this.setLoginStatus = function(status) {
        loginStatus = status;
        $cookieStore.put('loginStatus', status);
    }

    this.init = function() {
        loginStatus = $cookieStore.get('loginStatus');
    }
});

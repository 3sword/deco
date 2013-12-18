'use strict';

/* Services */

var decoServices = angular.module('decoServices', []);

decoServices.service('AuthenticationService',function(Restangular, $cookies){

    var loginStatus = false;
    var userName = "";

    this.isLoggedIn = function() {
        return loginStatus;
    }

    this.setLoginStatus = function(status) {
        loginStatus = status;
    }

    this.setUserName = function(name) {
        userName = name;
    }

    this.getUserName = function() {
        return userName;
    }

    this.init = function() {
        userName = $cookies.username;
        loginStatus = !!userName;
    }
});

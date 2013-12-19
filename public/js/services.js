'use strict';

/* Services */

var decoServices = angular.module('decoServices', []);

decoServices.service('AuthenticationService',function(Restangular, $cookies){

    var userName = $cookies.username;

    this.isLoggedIn = function() {
        return !!userName;
    }

    this.setUserName = function(name) {
        userName = name;
    }

    this.getUserName = function() {
        return userName;
    }

});

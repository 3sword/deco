'use strict';

/* Services */

var decoServices = angular.module('decoServices', []);

decoServices.service('AuthenticationService',function(Restangular, $cookies){

    var userId = $cookies.userid;
    var userName = "";

    this.isLoggedIn = function() {
        return !!userId;
    }

    this.setUser = function(id, name) {
        userId = id;
        userName = name;
    }

    this.getUserId = function() {
        return userId;
    }

    this.getUserName = function() {
        return userName;
    }

});

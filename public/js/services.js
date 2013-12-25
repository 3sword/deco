'use strict';

/* Services */

var decoServices = angular.module('decoServices', []);

decoServices.service('AuthenticationService',function(Restangular, $cookies, $cookieStore){

    var userId = $cookies.userid;
    var user;
    if (userId) {
        user = Restangular.one('login').get({userid: userId}).$object;
    }

    this.isLoggedIn = function() {
        return !!user;
    }

    this.setUser = function(data) {
        user = data;
    }

    this.getUser = function() {
        return user;
    }

    this.logout = function() {
        user = null;
        $cookieStore.remove('userid');
    }

});

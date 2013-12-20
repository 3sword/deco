'use strict';

/* Controllers */
var decoControllers = angular.module('decoControllers', []);

decoControllers.controller('LoginCtrl', function($scope, Restangular, AuthenticationService, $location) {
    $scope.loginHint = '';
    $scope.loginName = '';
    $scope.loginPassword = '';


    $scope.tryLogin = function() {

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

decoControllers.controller('HomeCtrl', function($scope, Restangular, $location) {
    $scope.report = Restangular.one('daily_reports','today').get().$object;

    $scope.showReport = function(){
        if ($scope.report) {
            $location.path("/daily_report");
        }
    }
});

decoControllers.controller('DailyReportCtrl', function($scope, Restangular, $location, $routeParams) {
    var date = $routeParams.date;

    $scope.$watch(function(){
        if (!$scope.report) {
            return null;
        } else {
            return $scope.report.content;
        }
    }, function(content) {
        content = content || "";
        $("#preview").html(markdown.toHTML(content));
    });

    $scope.report = Restangular.one('daily_reports',date).get().$object;

    $scope.showEdit = function() {
        return $scope.report.status && $scope.report.status != 'Published';
    }

    $scope.previewWidth = function(){
        if($scope.showEdit()) {
            return 6;
        } else {
            return 12;
        }
    }

    $scope.draft = function() {
        $('#draft-report-btn').css('opacity',0);
        Restangular.all('daily_reports').post($scope.report).then(function(){
            $('#draft-report-btn').animate({opacity:1}, 1000);
        });
    };

    $scope.publish = function() {
        Restangular.all('daily_reports').post($scope.report, {publish:true}).then(function(){
            $scope.report.status = "Published";
        });
    };
    $scope.back = function() {
        $location.path("/home");
    };
});
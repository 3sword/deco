'use strict';

/* Controllers */
var decoControllers = angular.module('decoControllers', []);

decoControllers.controller('LoginCtrl', function($scope, Restangular, AuthenticationService, $location) {

    $scope.tryLogin = function() {

        var data = {'username': $scope.loginName,
                    'password': $scope.loginPassword};

        Restangular.all('login').post(data).then(function(data){
            AuthenticationService.setUser(data[0], data[1]);
            $location.path('/home');
        }, function(response){
            AuthenticationService.setUser(null, null);
        });
    };
});

decoControllers.controller('SignupCtrl', function($scope, Restangular, AuthenticationService, $location) {

    $scope.trySignup = function() {
        if ($scope.loginPassword != $scope.confirmPassword) {
            $("#conpassword").css("border-color","#FF0000");
            return;
        }
        var data = {'username': $scope.loginName,
                    'realname': $scope.realName,
                    'password': $scope.loginPassword};

        Restangular.all('signup').post(data).then(function(data){
            AuthenticationService.setUser(data[0], data[1]);
            $location.path('/home');
        }, function(response){
            AuthenticationService.setUser(null, null);
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
    $scope.todaysReport = Restangular.one('my_daily_reports','today').get().$object;
    $scope.publishedReports = Restangular.all('published_daily_reports').getList().$object;
});

decoControllers.controller('DailyReportCtrl', function($scope, Restangular, $location, $routeParams, $filter) {

    var weekday=new Array(7), urlPrefix;
    weekday[0]="Sun";
    weekday[1]="Mon";
    weekday[2]="Tue";
    weekday[3]="Wed";
    weekday[4]="Thu";
    weekday[5]="Fri";
    weekday[6]="Sat";

    $scope.$watch(function(){
        if (!$scope.report) {
            return null;
        } else {
            return $scope.report.content;
        }
    }, function(content) {
        if (content) {
            $("#preview").html(markdown.toHTML(content));
        }
    });

    if ($routeParams.username == null) {
        urlPrefix = "my_daily_reports";
    } else {
        urlPrefix = "published_daily_reports/" + $routeParams.username;
    }
    $scope.navs=[];

    for (var i=-3; i<=3; i++){
        var date = new Date(new Date($routeParams.date).getTime() + (24 * 60 * 60 * 1000 * i)), nav = {};
        nav.href = "#/" + urlPrefix + "/" + $filter("date")(date, "yyyy-MM-dd");
        if (i==0) {
            nav.text = $filter("date")(date) + " " + weekday[date.getDay()];
        } else {
            nav.text = weekday[date.getDay()];
        }
        $scope.navs.push(nav);
    }

    Restangular.one(urlPrefix,$routeParams.date).get().then(function(data){
        $scope.report = data;
    }, function(response) {
        if (response.status == 404) {
            $("#preview").html('<span class="label label-default">Not published yet</span>');
        }
    });


    $scope.showEdit = function() {
        if (!$scope.report) {
            return null;
        }
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
        Restangular.all('my_daily_reports').post($scope.report).then(function(){
            $('#draft-report-btn').animate({opacity:1}, 1000);
        });
    };

    $scope.publish = function() {
        Restangular.all('my_daily_reports').post($scope.report, {publish:true}).then(function(){
            $scope.report.status = "Published";
        });
    };
    $scope.back = function() {
        $location.path("/home");
    };

});
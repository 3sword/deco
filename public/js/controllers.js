'use strict';

/* Controllers */
var decoControllers = angular.module('decoControllers', []);

decoControllers.controller('LoginCtrl', function($scope, Restangular, AuthenticationService, $location) {

    $scope.tryLogin = function() {

        var data = {'username': $scope.loginName,
                    'password': $scope.loginPassword};

        Restangular.all('login').post(data).then(function(data){
            AuthenticationService.setUser(data);
            $location.path('/home');
        }, function(response){
            AuthenticationService.setUser(null);
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
            AuthenticationService.setUser(data);
            $location.path('/home');
        }, function(response){
            AuthenticationService.setUser(null);
        });
    };
});


decoControllers.controller('HeadCtrl', function($scope, Restangular, AuthenticationService, $location) {
    $scope.$watch(function () {
        var user = AuthenticationService.getUser();
        if (user) {
            return user.realname;
        } else {
            return null;
        }
    }, function(username) {
        if (!!username){
            $scope.message = "Welcome, " + username + "!";
        } else{
            $scope.message = "";
        }
    });

    $scope.logout = function() {
        Restangular.all('logout').post().then(function() {
            AuthenticationService.logout();
            $location.path('/');
        })
    };

    $scope.isLoggedIn = function() {
        return AuthenticationService.isLoggedIn();
    };
});

decoControllers.controller('HomeCtrl', function($scope, Restangular, $location) {
    var today;
    Restangular.one('my_daily_reports','today').get().then(function(data){
        $scope.todaysReport = data;
        today = data.date;
        Restangular.all('published_daily_reports').getList().then(function(data){
            var len = data.length, i;
            for(i=0;i<len;i++) {
                data[i].dateDescription = convertDateDescription(data[i].date);
            }
            $scope.publishedReports = data;
        });
    });

    function convertDateDescription(date) {
        if (date == today) {
            return "today's report";
        } else {
            return "report of " + date;
        }
    }

});

decoControllers.controller('DailyReportCtrl', function($scope, Restangular, $location, $routeParams, $filter) {

    var weekday=new Array(7), urlPrefix, locationChangeStartEvent;
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
        content = content || "";
        $("#preview").html(markdown.toHTML(content));
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
        if(data.status != "Published") {
            window.onbeforeunload = function(){
                var message = 'Unsaved changes will be lost!';
                if (typeof event == 'undefined') {
                    event = window.event;
                }
                if (event) {
                    event.returnValue = message;
                }
                return message;
            };
            locationChangeStartEvent = $scope.$on('$locationChangeStart', function(event, next, current) {
                Restangular.all('my_daily_reports').post($scope.report);
                window.onbeforeunload = undefined;
            });
        }
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
            window.onbeforeunload = undefined;
            locationChangeStartEvent();
        });
    };
    $scope.back = function() {
        $location.path("/home");
    };

});


decoControllers.controller('ReportListCtrl', function($scope, Restangular, $location, $routeParams, AuthenticationService) {
    Restangular.all('users').getList().then(function(data){
        $scope.users = data;
        $scope.user = data.filter(function(o){
            return o.id == AuthenticationService.getUser().id;
        })[0];
        $scope.period = "tweek";
        $scope.fetchReports();
    });

    $scope.fetchReports = function () {
        Restangular.all('published_daily_reports').getList({userid: $scope.user.id, period:$scope.period}).then(function(data){
            var len = data.length, i;
            for(i=0;i<len;i++) {
                data[i].formattedContent = markdown.toHTML(data[i].content);
            }
            $scope.reports = data;
        });
    }
});

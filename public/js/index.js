function indexCtrl($scope, $http) {

    $http.get('/daily_reports/today/status').
        success(function(data, status, headers, config) {
            $scope.statusToday = data;
        }).
        error(function(data, status, headers, config) {
           
        });
};

function loginCtrl($scope, $http) {

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
        $http.post('/login', data).
            success(function(data, status, headers, config) {
                window.location = "/";
            }).
            error(function(data, status, headers, config) {
                $scope.loginHint = "fail";
            });

    };
};


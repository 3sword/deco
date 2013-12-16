function timelineCtrl($scope) {

    // defaults one day before
    $scope.timeFrom = Date.now() - 1 * 1000 * 60 * 60 * 24;
    $scope.timeTo = Date.now();
    $scope.density = 10;  // how many time points on the time line
    $scope.timestamps = [];  // in pair, time, left

    $scope.refresh = function() {
        var step = ($scope.timeFrom - $scope.timeTo) / $scope.density;
        var t = $scope.timeFrom;
        $scope.timestamps = [];
        for (var i = 0; i <= $scope.density; i++) {
            $scope.timestamps.push(t);
            t += step;
        }
    };

};


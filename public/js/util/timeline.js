function timelineCtrl($scope) {

    var DENSITY_MIN = 10;
    var DENSITY_MAX = 20;


    // defaults one day before
    $scope.timeFrom = Date.now() - 1 * 1000 * 60 * 60 * 24;
    $scope.timeTo = Date.now();
    $scope.density = 20;  // how many time duration on the time line
                         // density + 1 points
    $scope.timestamps = [];  // in pair, time, left


    $scope.refresh = function() {
        var timeStep = ($scope.timeFrom - $scope.timeTo) / $scope.density;
        var time = $scope.timeFrom;
        $scope.timestamps = [];
        var dateWidth = document.querySelector("#top-timeline > .date").offsetWidth;
        var timestampsWidth = document.querySelector("#top-timeline").offsetWidth;
        var widthStep = (timestampsWidth - dateWidth * 2) / $scope.density;
        for (var i = 0; i <= $scope.density; i++) {
            var o = {};
            o['left'] = dateWidth + i * widthStep;
            o['time'] = time;
            $scope.timestamps.push(o);
            time += timeStep;
        }
    };

};


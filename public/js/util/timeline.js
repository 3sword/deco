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
        var divs = document.querySelectorAll("#top-timeline > div");
        console.log(divs);
        var totalWidth = divs[2].offsetLeft - divs[0].offsetRight;
        console.log(divs[2].offsetLeft);
        console.log(divs[0].offsetRight);
        console.log(totalWidth);
        //for (var i = 0; i <= $scope.density; i++) {
        //    var o = {};
        //    o['left'] = i * 10;
        //    o['time'] = t;
        //    $scope.timestamps.push(o);
        //    t += step;
        //}
    };

};


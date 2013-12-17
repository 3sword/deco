function timelineCtrl($scope, $timeout) {

    var DENSITY_MIN = 10;
    var DENSITY_MAX = 20;
    var timeSize = 20;

    // defaults one day before
    $scope.timeFrom = Date.now() - 1 * 1000 * 60 * 60 * 24;
    $scope.timeTo = Date.now();
    $scope.timestamps = [];  // in pair, time, left
    $scope.mouseX = 0;
    $scope.showOperation = true;


    $scope.refresh = function() {
        var timeStep = ($scope.timeFrom - $scope.timeTo) / timeSize;
        var time = $scope.timeFrom;
        $scope.timestamps = [];
        var dateWidth = document.querySelector("#top-timeline > .date").offsetWidth;
        var timestampsWidth = document.querySelector("#top-timeline").offsetWidth;
        // 2 date label and the last time label, which is 3 em in css.
        var widthStep = (timestampsWidth - dateWidth * 2 - dateWidth * 3/4) / (timeSize-1);
        for (var i = 0; i < timeSize; i++) {
            var o = {};
            o['left'] = dateWidth + i * widthStep;
            o['time'] = time;
            $scope.timestamps.push(o);
            time += timeStep;
        }
    };

    $scope.triggerTimeline = function(ev) {
        $scope.showOperation = true;
        console.log(ev.toElement.class);
        if (ev.toElement.id == "top-timeline" || ev.toElement.classList.contains('time')) {
            $scope.mouseX = ev.clientX - 30;
        }
        console.log(ev);
        var time = function(ev) {
            console.log(ev.clientX);
            return 1;
        }(ev);
    }

    $scope.hideOperationPanel = function(ev) {
        $timeout(function() {
            if (ev.toElement.id != "op-cursor") {
                $scope.showOperation = false;
            }
        }, 1000);
    }

};


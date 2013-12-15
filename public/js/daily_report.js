function dailyReportCtrl($scope, $http) {

	$http.get('/daily_reports/today').
	success(function(data, status, headers, config) {
		$scope.report = data;
	}).
	error(function(data, status, headers, config) {

	});

	$scope.draft = function() {
		$http.post('/daily_reports', $scope.report).
		success(function(data, status, headers, config) {
		}).
		error(function(data, status, headers, config) {

		});

	};

	$scope.publish = function() {
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

	$scope.back = function() {
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

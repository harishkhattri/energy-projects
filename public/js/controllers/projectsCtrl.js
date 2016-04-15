//public/js/controllers/projectsCtrl.js

angular.module('ProjectCtrl', []).controller('ProjectController', function($scope, $http) {
	
	//Total MW
	$http.get('/projects/getTotalMW/15/4/2016')
	.success(function(data){
		$scope.totalMW = data[0].totalMW.toFixed(2);
		$scope.totalCount = data[0].count;
		
		getAnalytics();
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	
	var getAnalytics = function() {
		//MW by Fuel Type
		$http.get('/projects/getMWByFuelType/15/4/2016')
		.success(function(data){
			$scope.MWByFuelType = [];
			for (var i = 0; i < data.length; i++ ){
				var fuelTypeData = {
						"percentage": ((data[i].totalMW / $scope.totalMW) * 100).toFixed(2) ,
						"fuelType": data[i].fuelType,
						"actualMW" : Math.round(data[i].totalMW)
				};
				
				$scope.MWByFuelType.push(fuelTypeData);
				var chart = AmCharts.makeChart( "chartdiv", {
					  "type": "pie",
					  "theme": "light",
					  "dataProvider":$scope.MWByFuelType,
					  "valueField": "percentage",
					  "titleField": "fuelType",
					   "balloon":{
					   "fixedPosition":true
					  },
					  "export": {
					    "enabled": true
					  }
					} );
			}
		})
		
		.error(function(data) {
				console.log('Error: ' + data);
		});
		
		
		//MW by Status
		$http.get('/projects/getMWByStatus/15/4/2016')
		.success(function(data){
			$scope.MWByStatus = [];
			for (var i = 0; i < data.length; i++ ){
				var mwByStatusData = {
						"percentage": ((data[i].totalMW / $scope.totalMW) * 100).toFixed(2),
						"status": data[i].status,
						"actualMW" : Math.round(data[i].totalMW)
				};
				
				$scope.MWByStatus.push(mwByStatusData);
				
				var chart2 = AmCharts.makeChart( "chartdiv2", {
					  "type": "pie",
					  "theme": "light",
					  "dataProvider":$scope.MWByStatus,
					  "valueField": "percentage",
					  "titleField": "status",
					   "balloon":{
					   "fixedPosition":true
					  },
					  "export": {
					    "enabled": true
					  }
					} );
			}
		})
		
		.error(function(data) {
				console.log('Error: ' + data);
		 });
		
		
		 //Top 5 states by highest MW
		$http.get('/projects/getMWByState/5/15/4/2016')
		.success(function(data){
			for (var i = 0; i < data.length; i++) {
				data[i].totalMW = data[i].totalMW.toFixed(2);
				data[i].percentage = ((data[i].totalMW / $scope.totalMW) * 100).toFixed(2);
			}

			$scope.MWByState = data;
		})
		
		.error(function(data) {
				console.log('Error: ' + data);
		 });
		
		//Top 5 states by highest project count
		$http.get('/projects/getCountByState/5/15/4/2016')
		.success(function(data){
			$scope.projectByTop = data;
		})
		
		.error(function(data) {
				console.log('Error: ' + data);
		 });
		
		
		//Top 5 counties by highest MW
		$http.get('/projects/getMWByCounty/5/15/4/2016')
		.success(function(data){
			for (var i = 0; i < data.length; i++) {
				data[i].totalMW = data[i].totalMW.toFixed(2);
				data[i].percentage = ((data[i].totalMW / $scope.totalMW) * 100).toFixed(2);
			}
			
			$scope.countyByTopMW = data;
		})
		
		.error(function(data) {
				console.log('Error: ' + data);
		 });
		
		//Top 5 counties by highest project count
		$http.get('/projects/getCountByCounty/5/15/4/2016')
		.success(function(data){
			$scope.CountByCounty = data;
		})
		
		.error(function(data) {
				console.log('Error: ' + data);
		 });
	};

});
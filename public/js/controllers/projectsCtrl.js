//public/js/controllers/projectsCtrl.js

angular.module('ProjectCtrl', []).controller('ProjectController', function($scope, $http) {
	
	//Total MW
	$http.get('/projects/getTotalMW')
	.success(function(data){
		$scope.totalMW = data[0].totalMW;
	})
	
	.error(function(data) {
		console.log('Error: ' + data);
	});
	
	//MW by Fuel Type
	$http.get('/projects/getMWByFuelType')
	.success(function(data){
		$scope.MWByFuelType = [];
		for (var i = 0; i < data.length; i++ ){
			var fuelTypeData = {
					"percentage": (data[i].totalMW / $scope.totalMW) * 100 ,
					"fuelType": data[i].fuelType
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
	$http.get('/projects/getMWByStatus')
	.success(function(data){
		$scope.MWByStatus = [];
		for (var i = 0; i < data.length; i++ ){
			var mwByStatusData = {
					"percentage": (data[i].totalMW / $scope.totalMW) * 100 ,
					"status": data[i].status
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
	
	
	 //Top 3 states by highest MW
	/*$http.get('/projects/getMWByState/:3')
	.success(function(data){
		$scope.MWByState = [];
		console.log(data);
	})
	
	.error(function(data) {
			console.log('Error: ' + data);
	 });*/

});
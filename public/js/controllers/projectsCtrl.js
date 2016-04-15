//public/js/controllers/projectsCtrl.js

angular.module('ProjectCtrl', []).controller('ProjectController', function($scope, $http,$filter) {
	
	//Total MW

	var dt=new Date();
	$scope.dateObj={};
	$scope.dateObj.day=dt.getDate();
	$scope.dateObj.month=(dt.getMonth() + 1);
	$scope.dateObj.year=(dt.getFullYear() );

	function getDateString(dtObj){
		console.log(dtObj.day+'/'+dtObj.month+'/'+dtObj.year);
		return dtObj.day+'/'+dtObj.month+'/'+dtObj.year;
	}

	function getTotalMW(dtString) {
		$http.get('/projects/getTotalMW/' + dtString)
			.success(function (data) {
				if(data.length>0) {
					$scope.totalMW = data[0].totalMW.toFixed(2);
					$scope.totalCount = data[0].count;

					getAnalytics(dtString);
				}
				else{

					getAnalytics(dtString)
				}
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});
	}
	
	var getAnalytics = function(dtString) {
		//MW by Fuel Type

		$http.get('/projects/getMWByFuelType/'+dtString)

		.success(function(data){
			$scope.MWByFuelType = [];
			for (var i = 0; i < data.length; i++ ){
				var fuelTypeData = {
						"percentage": ((data[i].totalMW / $scope.totalMW) * 100).toFixed(2) ,
						"fuelType": data[i].fuelType,
						"actualMW" : Math.round(data[i].totalMW)
				};
				
				$scope.MWByFuelType.push(fuelTypeData);

			}
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
		})
		
		.error(function(data) {
				console.log('Error: ' + data);
		});
		
		
		//MW by Status

		$http.get('/projects/getMWByStatus/'+dtString)

		.success(function(data){
			$scope.MWByStatus = [];
			for (var i = 0; i < data.length; i++ ){
				var mwByStatusData = {
						"percentage": ((data[i].totalMW / $scope.totalMW) * 100).toFixed(2),
						"status": data[i].status,
						"actualMW" : Math.round(data[i].totalMW)
				};
				
				$scope.MWByStatus.push(mwByStatusData);
				

			}
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
		})
		
		.error(function(data) {
				console.log('Error: ' + data);
		 });
		
		
		 //Top 5 states by highest MW

		$http.get('/projects/getMWByState/5/'+dtString)

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

		$http.get('/projects/getCountByState/5/'+dtString)

		.success(function(data){
			$scope.projectByTop = data;
		})
		
		.error(function(data) {
				console.log('Error: ' + data);
		 });
		
		
		//Top 5 counties by highest MW

		$http.get('/projects/getMWByCounty/5/'+dtString)

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

		$http.get('/projects/getCountByCounty/5/'+dtString)

		.success(function(data){
			$scope.CountByCounty = data;
		})
		
		.error(function(data) {
				console.log('Error: ' + data);
		 });
	};




	$scope.dateselected = new Date();
	$scope.dpOpenStatus = {};
	$scope.setDpOpenStatus = function(id) {
		$scope.dpOpenStatus[id] = true
	};
	$scope.$watch("dateselected", function(newValue, oldValue) {
		resetValues();
		$scope.dateObj.day=$scope.dateselected.getDate();
		$scope.dateObj.month=($scope.dateselected.getMonth() + 1);
		$scope.dateObj.year=($scope.dateselected.getFullYear() );
		console.log("I've changed : ",getDateString($scope.dateObj));
		var dateQuery=getDateString($scope.dateObj);

		getTotalMW(dateQuery);

	});

	function resetValues(){
		$scope.totalMW = "";
		$scope.totalCount = "";
		$scope.MWByFuelType = [];
		$scope.MWByState="";
		$scope.projectByTop="";
		$scope.countyByTopMW="";
		$scope.CountByCounty="";

	}

});
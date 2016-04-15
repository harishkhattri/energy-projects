// app/routes.js
// Defines various routes for server and front end

var Projects = require("./models/project");

module.exports = function(app) {
	// Server routes
	app.get('/favicon.ico', function(request, response) {
		response.writeHead(200, {'Content-Type': 'image/x-icon'} );
		response.end();
	});
	
	// Get total number of MW
	app.get('/projects/getTotalMW/:day/:month/:year', function(request, response) {
		var day = parseInt(request.params.day);
		var month = parseInt(request.params.month);
		var year = parseInt(request.params.year);
		
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]},
					"dataEntryDate.day": day, "dataEntryDate.month": month, "dataEntryDate.year": year} },
				{ $group: {_id: null, totalMW: {$sum: "$mw"}, count: {$sum: 1} } },
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get project size (in MW) by fuel type
	app.get('/projects/getMWByFuelType/:day/:month/:year', function(request, response) {
		var day = parseInt(request.params.day);
		var month = parseInt(request.params.month);
		var year = parseInt(request.params.year);

		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]},
					"dataEntryDate.day": day, "dataEntryDate.month": month, "dataEntryDate.year": year} },
				{ $group: {_id: {fuelType: "$fuelType"}, totalMW: {$sum: "$mw"} } },
				{ $project: {_id: 0, fuelType: "$_id.fuelType", totalMW: 1} },
				{ $sort: {totalMW: -1} },
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get project size (in MW) by interconnection status
	app.get('/projects/getMWByStatus/:day/:month/:year', function(request, response) {
		var day = parseInt(request.params.day);
		var month = parseInt(request.params.month);
		var year = parseInt(request.params.year);
		
		Projects.aggregate(
				{ $match: {"dataEntryDate.day": day, "dataEntryDate.month": month, "dataEntryDate.year": year} },
				{ $group: {_id: {status: "$status"}, totalMW: {$sum: "$mw"} } },
				{ $project: {_id: 0, status: "$_id.status", totalMW: 1} },
				{ $sort: {totalMW: -1} },
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get top n states by highest MW; where n will be page size
	app.get('/projects/getMWByState/:pageSize/:day/:month/:year', function(request, response) {
		var pageSize = parseInt(request.params.pageSize);
		var day = parseInt(request.params.day);
		var month = parseInt(request.params.month);
		var year = parseInt(request.params.year);
		
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]},
					"dataEntryDate.day": day, "dataEntryDate.month": month, "dataEntryDate.year": year} },
				{ $group: {_id: {state: "$state"}, totalMW: {$sum: "$mw"} } },
				{ $project: {_id: 0, state: "$_id.state", totalMW: 1} },
				{ $sort: {totalMW: -1} },
				{ $limit: pageSize},
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get top n states by highest project count; where n will be page size
	app.get('/projects/getCountByState/:pageSize/:day/:month/:year', function(request, response) {
		var pageSize = parseInt(request.params.pageSize);
		var day = parseInt(request.params.day);
		var month = parseInt(request.params.month);
		var year = parseInt(request.params.year);
		
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]},
					"dataEntryDate.day": day, "dataEntryDate.month": month, "dataEntryDate.year": year} },
				{ $group: {_id: {state: "$state"}, count: {$sum: 1} } },
				{ $project: {_id: 0, state: "$_id.state", count: 1} },
				{ $sort: {count: -1} },
				{ $limit: pageSize},
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get top n counties by highest MW; where n will be page size
	app.get('/projects/getMWByCounty/:pageSize/:day/:month/:year', function(request, response) {
		var pageSize = parseInt(request.params.pageSize);
		var day = parseInt(request.params.day);
		var month = parseInt(request.params.month);
		var year = parseInt(request.params.year);
		
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]},
					"dataEntryDate.day": day, "dataEntryDate.month": month, "dataEntryDate.year": year} },
				{ $group: {_id: {county: "$county"}, totalMW: {$sum: "$mw"} } },
				{ $project: {_id: 0, county: "$_id.county", totalMW: 1} },
				{ $sort: {totalMW: -1} },
				{ $limit: pageSize},
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get top n counties by highest project count; where n will be page size
	app.get('/projects/getCountByCounty/:pageSize/:day/:month/:year', function(request, response) {
		var pageSize = parseInt(request.params.pageSize);
		var day = parseInt(request.params.day);
		var month = parseInt(request.params.month);
		var year = parseInt(request.params.year);
		
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]},
					"dataEntryDate.day": day, "dataEntryDate.month": month, "dataEntryDate.year": year} },
				{ $group: {_id: {county: "$county"}, count: {$sum: 1} } },
				{ $project: {_id: 0, county: "$_id.county", count: 1} },
				{ $sort: {count: -1} },
				{ $limit: pageSize},
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Frontend routes
	app.get('/', function(request, response) {
		var options = {
				root: "./public"
		};
		response.sendFile('index.html', options);
	});
};
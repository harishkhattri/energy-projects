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
	app.get('/projects/getTotalMW', function(request, response) {
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]}} },
				{ $group: {_id: null, totalMW: {$sum: "$mw"} } },
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get project size (in MW) by fuel type
	app.get('projects/getMWByFuelType', function(request, response) {
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]}} },
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
	app.get('projects/getMWByStatus', function(request, response) {
		Projects.aggregate(
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
	
	// Get top 3 states by highest MW
	app.get('projects/getMWByState/:pageSize', function(request, response) {
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]}} },
				{ $group: {_id: {state: "$state"}, totalMW: {$sum: "$mw"} } },
				{ $project: {_id: 0, state: "$_id.state", totalMW: 1} },
				{ $sort: {totalMW: -1} },
				{ $limit: request.params.pageSize},
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get top 3 states by highest project count
	app.get('projects/getCountByState/:pageSize', function(request, response) {
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]}} },
				{ $group: {_id: {state: "$state"}, count: {$sum: 1} } },
				{ $project: {_id: 0, state: "$_id.state", count: 1} },
				{ $sort: {count: -1} },
				{ $limit: request.params.pageSize},
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get top 3 counties by highest MW
	app.get('projects/getMWByCounty/:pageSize', function(request, response) {
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]}} },
				{ $group: {_id: {county: "$county"}, totalMW: {$sum: "$mw"} } },
				{ $project: {_id: 0, county: "$_id.county", totalMW: 1} },
				{ $sort: {totalMW: -1} },
				{ $limit: request.params.pageSize},
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get top 3 counties by highest project count
	app.get('projects/getCountByCounty/:pageSize', function(request, response) {
		Projects.aggregate(
				{ $match: {status: {$nin: ["Cancelled", "Suspended"]}} },
				{ $group: {_id: {county: "$county"}, count: {$sum: 1} } },
				{ $project: {_id: 0, county: "$_id.county", count: 1} },
				{ $sort: {count: -1} },
				{ $limit: request.params.pageSize},
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
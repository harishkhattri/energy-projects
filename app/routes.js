// app/routes.js
// Defines various routes for server and front end

var Projects = require("./models/project");

module.exports = function(app) {
	// Server routes
	
	// Get total number of MW
	app.get('/projects/getTotalMW', function(request, response) {
		Projects.aggregate(
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
				{ $group: {_id: {fuelType: "$fuelType"}, totalMW: {$sum: "$mw"} } },
				{ $project: {_id: 0, fuelType: "$_id.fuelType", totalMW: "$totalMW"} },
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
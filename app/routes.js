// app/routes.js
// Defines various routes for server and front end

var Projects = require("./models/project");
var Customers = require("./models/cust_info");

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
	
	// Get statistics based on document status
	app.get('/customers/getStatsByDocStatus', function(request, response) {
		Customers.aggregate(
				{ $group: {_id: {docStatus: "$docStatus"}, count: {$sum: 1} } },
				{ $project: {_id: 0, docStatus: "$_id.docStatus", count: 1} },
				{ $sort: {docStatus: 1} },
				function(error, result) {
					if (error) {
						response.send(error);
					}
					
					response.send(result);
				});
	});
	
	// Get interconnection data with customer info
	app.get('/customers/getData', function(request, response) {
		Projects.find({"dataEntryDate.day": 15, "dataEntryDate.month": 4, "dataEntryDate.year": 2016}, null, {sort: {queueNumber: 1}},
				function(error, projects) {
			if (error) {
				response.send(error);
			}
			
			var data = [];
			
			var goNext = function(counter) {
				counter++;
				
				if (counter < projects.length) {
					getData(counter);
				} else {
					response.json(data);
				}
			};
			
			// Recursive function to handle asynchronous calls to fetch additional information from database
			var getData = function(counter) {
				var project = projects[counter];
				var projectData = {
						queue: project.queueNumber,
						queueDate: project.attachNRecd.month + '/' + project.attachNRecd.day + '/' + project.attachNRecd.year,
						projectName: project.projectName,
						mw: project.mw,
						mwInService: project.mwInService,
						status: project.status,
						state: project.state,
						county: project.county,
						inServiceDate: project.inServiceDate.year + ' ' + project.inServiceDate.quarter,
						fuelType: project.fuelType,
						isaStatus: project.isaStatus
				};
				
				if (project.isaStatus === 's' || project.isaStatus === 'notrequired') {
					data.push(projectData);
					goNext(counter);
				} else {
					Customers.find({fileName: project.isaFileName}, function(err, customers) {
						if (err) {
							response.send(err);
						}
						
						if (customers.length > 0) {
							var isaFileUrl = "http://www.pjm.com/pub/planning/project-queues/";
							
							if (customers[0].fileType === 'isa') {
								isaFileUrl += "isa/" + customers[0].fileName;
							} else {
								isaFileUrl += "wmpa/" + customers[0].fileName;
							}
							
							projectData.isaStatus = isaFileUrl;
							projectData.docStatus = customers[0].docStatus;
							projectData.custName = customers[0].name;
							projectData.custLocation = customers[0].location;
						}
						
						data.push(projectData);
						goNext(counter);
					});
				}
			};
			
			if (projects.length > 0) {
				getData(0);
			} else {
				response.json(data);
			}
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
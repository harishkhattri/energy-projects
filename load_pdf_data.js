var fs = require("fs");
var mongoose = require("mongoose");
var db = require("./config/db");
var Customers = require("./app/models/cust_info");
var custData = require("./search_results.json");

var load_customer_data = function() {
	var allCustomersData = [];
	
	for(var i = 0; i < custData.length; i++) {
		var customer = custData[i];
		var customerName = "";
		var customerLocation = "";
		
		if (customer.results[0].keyword.startsWith('Location')) {
			if (customer.results[0].text.length > 0) {
				customerLocation = customer.results[0].text[0];
			} else {
				customerLocation = 'Not Found';
			}
			
			if (customer.results[1].text.length > 0) {
				customerName = customer.results[1].text[0];
			} else {
				customerName = 'Not Found';
			}
		} else {
			if (customer.results[0].text.length > 0) {
				customerName = customer.results[0].text[0];
			} else {
				customerName = 'Not Found';
			}
			
			if (customer.results[1].text.length > 0) {
				customerLocation = customer.results[1].text[0];
			} else {
				customerLocation = 'Not Found';
			}
		}
		
		var customerData = {
				name: customerName,
				location: customerLocation,
				fileName: customer.fileName,
				fileType: customer.fileName.split('.')[0].endsWith('wmpa') ? 'wmpa' : 'isa',
				fileValid: customer.fileValid,
				fileScanned: !customer.fileSearchable
		};
		
		allCustomersData.push(customerData);
	}
	
	mongoose.connect(db.url);
	
	Customers.create(allCustomersData, function(error, customers) {
		if (error) {
			console.log("Database error.\n" + error.message);
			mongoose.disconnect();
			return;
		}
		
		console.log("Data is successfully entered in database.");
		mongoose.disconnect();
	});
};

load_customer_data();
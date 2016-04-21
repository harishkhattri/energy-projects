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
		var docStatus = "";
		
		if (customer.results[0].keyword.indexOf('Location') !== -1) {
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
		
		var fileType = ((customer.fileName.split('.')[0].indexOf('wmpa') !== -1) ? 'wmpa' : 'isa');
		
		if (!customer.fileValid) {
			docStatus = "Document Corrupted";
		} else if (!customer.fileSearchable) {
			docStatus = "Scanned Document";
		} else if (customer.results[0].text.length === 0 && customer.results[1].text.length == 0) {
			docStatus = "Not Found";
		} else {
			docStatus = "Found";
		}
		
		var customerData = {
				name: customerName,
				location: customerLocation,
				fileName: customer.fileName,
				fileType: fileType,
				docStatus: docStatus
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
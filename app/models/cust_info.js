var mongoose = require("mongoose");

module.exports = mongoose.model('Customers', {
	name: {type: String},
	location: {type: String},
	fileName: {type: String},
	fileType: {type: String},
	docStatus: {type: String}
});
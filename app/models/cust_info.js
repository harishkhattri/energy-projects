var mongoose = require("mongoose");

module.exports = mongoose.model('customers', {
	name: {type: String},
	location: {type: String},
	fileName: {type: String},
	fileType: {type: String},
	fileValid: {type: Boolean},
	fileScanned: {type: Boolean}
});
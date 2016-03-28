var mongoose = require("mongoose");

module.exports = mongoose.model('Lists', {
	queueNumber: {type: String},
	queueLetter: {type: String},
	aq: {type: Boolean},
	counter: {type: Boolean},
	projectName: {type: String},
	mw: {type: Number},
	attachNrecd: {
		month : {type : Number},
		date : {ttype : Number},
		year : {type : Number}
	},
	ce: {type: String},
	gt: {type: String},
	statusCode: {type: String},
	mwc: {type: Number},
	mwe: {type: Number},
	remarks: {type: String},
	inServiceDate: {
		year : {type : Number},
		quarter : {type : String}
    },
	fuelType: {type: String},
	state: {type: String},
	feasibilityFileName: {type: String},
	impactFileName: {type: String},
	facilityFileName: {type: String},
	isaFileName: {type: String},
	csaFileName: {type: String},
	feasibilityStatus: {type: String},
	impactStatus: {type: String},
	facilityStatus: {type: String},
	isaStatus: {type: String},
	csaStatus: {type: String},
	feasibilityFileName2: {type: String},
	impactFileName2: {type: String},
	facilityFileName2: {type: String},
	isaFileName2: {type: String},
	csaFileName2: {type: String},
	feasibilityStatus2: {type: String},
	impactStatus2: {type: String},
	isaStatus2: {type: String},
	csaStatus2: {type: String},
	transmissionOwner: {type: String},
	dateSuspended: {type: String},
	withdrawlDate: {type: String},
	county: {type: String},
	wmpaStatus: {type: String},
	projectType: {type: String},
	ac: {type: String},
	dc: {type: String},
	attachmentType: {type: String},
	STATUS: {type: String},
	mwInservice: {type: String},
	revisedInServiceDate: {type: String},
	isaFileNameUseAltFolder: {type: Boolean}
});
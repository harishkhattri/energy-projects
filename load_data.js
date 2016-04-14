var fs = require("fs");
var request = require("ajax-request");
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var mongoose = require("mongoose");
var db = require("./config/db");
var Projects = require("./app/models/project");

request.download({
		url: 'http://www.pjm.com/pub/account/gen-queues/gen_queue_all.xml',
		destPath: __dirname + "/gen_queue_all.xml"
	}, function(error, response, body, destPath) {
		fs.readFile(__dirname + "/gen_queue_all.xml", function(error, data) {
			if (error) {
				console.log("File not found.");
				return;
			}
			
			parser.parseString(data, function(err, result) {
				if (err) {
					console.log("Parsing error.");
					return;
				}

				var allProjects = result.NewDataSet.TIPlanning;
				var allProjectsData = [];
				var dataEntryDate = new Date();
				
				for (var i = 0; i < allProjects.length; i++) {
					var project = allProjects[i];
					var queueDate = project.AttachNrecd[0].split('/');
					var inServiceDate = project.InServiceDate[0].split(' ');
					
					var projectData = {
							queueNumber: project.QueueNumber[0],
							queueLetter: project.QueueLetter[0],
							aq: project.AQ[0],
							counter: project.Counter[0],
							projectName: project.ProjectName[0],
							mw: project.MW[0],
							attachNRecd: {
								month : queueDate[0],
								day : queueDate[1],
								year : queueDate[2]
							},
							ce: project.CE[0],
							gt: project.GT[0],
							statusCode: project.StatusCode[0],
							mwc: project.MWC[0],
							mwe: project.MWE[0],
							remarks: project.Remarks[0],
							inServiceDate: {
								year : inServiceDate[0],
								quarter : inServiceDate[1]
						    },
							fuelType: project.FuelType[0],
							state: project.State[0],
							feasibilityFileName: project.FeasibilityFileName[0],
							impactFileName: project.ImpactFileName[0],
							facilityFileName: project.FacilityFileName[0],
							isaFileName: project.ISAFileName[0],
							csaFileName: project.CSAFileName[0],
							feasibilityStatus: project.FeasibilityStatus[0],
							impactStatus: project.ImpactStatus[0],
							facilityStatus: project.FacilityStatus[0],
							isaStatus: project.ISAStatus[0],
							csaStatus: project.CSAStatus[0],
							feasibilityFileName2: project.FeasibilityFileName2[0],
							impactFileName2: project.ImpactFileName2[0],
							facilityFileName2: project.FacilityFileName2[0],
							isaFileName2: project.ISAFileName2[0],
							csaFileName2: project.CSAFileName2[0],
							feasibilityStatus2: project.FeasibilityStatus2[0],
							impactStatus2: project.ImpactStatus2[0],
							facilityStatus2: project.FacilityStatus2[0],
							isaStatus2: project.ISAStatus2[0],
							csaStatus2: project.CSAStatus2[0],
							transmissionOwner: project.TransmissionOwner[0],
							dateSuspended: project.DateSuspended[0],
							withdrawlDate: project.WithdrawlDate[0],
							county: project.County[0],
							wmpaStatus: project.WMPAStatus[0],
							projectType: project.ProjectType[0],
							ac: project.AC[0],
							dc: project.DC[0],
							attachmentType: project.AttachmentType[0],
							status: project.Status[0],
							mwInService: project.MWInservice[0],
							revisedInServiceDate: project.RevisedInServiceDate[0],
							isaFileNameUseAltFolder: project.ISAFileNameUseAltFolder[0],
							dataEntryDate: {
								month: dataEntryDate.getMonth() + 1,
								day: dataEntryDate.getDate(),
								year: dataEntryDate.getFullYear()
							}
					};
					
					allProjectsData.push(projectData);
				}
				
				mongoose.connect(db.url);

				Projects.create(allProjectsData, function(error, project) {
					if (error) {
						console.log("Database error.\n" + error.message);
						mongoose.disconnect();
						return;
					}
					
					console.log("Data is successfully entered in database.");
					mongoose.disconnect();
				});
			});
		});
	});
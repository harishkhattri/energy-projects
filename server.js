// server.js
// This is the main file of the backend

// include modules
var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

// configuration
var port = process.env.PORT || 8080;
var mongoDbUrl = "mongodb://localhost/projects";

mongoose.connect(mongoDbUrl);

app.use(bodyParser.json());
app.use(bodyParser.json({type: "application/vnd.api+json"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// routes
require("./app/routes")(app);

// start app
app.listen(port);

exports = module.exports = app;
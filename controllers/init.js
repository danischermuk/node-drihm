var mongoose = require('mongoose');

// Inicializamos la DB
// Connect to the db MongoDB
exports.initMongoDB = function () {
	mongoose.connect('mongodb://localhost:27017/base');

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'error connecting with mongodb database:'));
	
	db.once('open', function() {
	  console.log('connected to mongodb database');
	});    
	
	db.on('disconnected', function () {
	   //Reconnect on timeout
	   mongoose.connect('mongodb://localhost:27017/base');
	   db = mongoose.connection;
	});

};

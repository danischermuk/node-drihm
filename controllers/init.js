var mongoose = require('mongoose');

// Inicializamos la DB
// Connect to the db MongoDB
exports.initMongoDB = function () {
	mongoose.connect('mongodb://localhost:27017/base');
};

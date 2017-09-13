var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// Create connection to database
var config = {
	userName: 'sa', // update me
	password: '1', // update me
	server: 'SRV-DRIHM',
	options: {
		database: 'DRIHM'
	}
}

var connection;
var connectionStatus = "closed";

var onConnectionConnect = function (err) {
	connectionStatus = "connected";
	console.log("Conectado a la DB");
};

var onConnectionEnd = function () {
	connectionStatus = "end";
};

var onConnectionError = function (err) {
	connectionStatus = "error";
};

module.exports.init = function () {
	connection = new Connection(config);
	connection.on('connect', onConnectionConnect);
	connection.on('end', onConnectionEnd);
	connection.on('error', onConnectionError);

};

module.exports.sqlQuery = function (query) {
	return new Promise((resolve, reject) => {
		// Hago la lógica de la función

		if (connectionStatus != "connected") {
			// la conexión no está bien
			console.log("Error en la conexion SQL - NO Conectada");
			return reject("Error - DB not connected");
		}
		else {
			request = new Request(
				query,
				function (err, rowCount, rows) {
					if (err) {
						//Loguear el error, FALTA reportarlo
						console.log(err);
					} else	{
						console.log(rowCount + ' rows returned');  
						return resolve(data);
					}
						

				});

			//Print the rows read
			var r = 0, c = 0;
			var keys = [];
			var data = [];
			request.on('row', function (columns) {
				c = 0;
				var line = {};
				r++;
				columns.forEach(function (column) {
					// if (column.value === null)
					// 	line[keys[c]] = "NULL";
					// else
						line[keys[c]] = column.value;

					c++;
				});
				data.push(line);
			});

			request.on('columnMetadata', function (columns) {
				columns.forEach(function (column) {
					// if (column.value === null)
					// 	console.log('NULL');
					// else
						keys.push(column.colName);
				});
			});

			// Execute SQL statement
			connection.execSql(request);
		}
	})

};

exports.doQuery = async function(req, res) {
	var query = req.body.query;
	// console.log(query);
	var data =  await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
  };
  
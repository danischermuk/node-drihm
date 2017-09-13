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
			var keyType = [];
			var data = [];
			request.on('row', function (columns) {
				c = 0;
				var line = {};
				r++;
				columns.forEach(function (column) {
					// if (column.value === null)
					// 	line[keys[c]] = "NULL";
					// else

					if((keyType[c] === 'DecimalN' || keyType[c] === 'Int' ) && column.value === null)
						line[keys[c]] = 0;
					else
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
						keyType.push(column.type.name);
				});
			});

			// Execute SQL statement
			connection.execSql(request);
		}
	})

};

exports.sqlQueryProductsStock = async function(req, res) {
	var query = 'SELECT dbo.Articulo.Regis_Arti, dbo.Articulo.CodInternoArti, dbo.Articulo.DescripcionArti, dbo.ArticuloStock.Stock1_StkArti, dbo.ArticuloNivelIntegra1.DescrNivelInt1, dbo.ArticuloNivelIntegra2.DescrNivelInt2, dbo.ArticuloNivelIntegra3.DescrNivelInt3, dbo.ArticuloNivelIntegra4.DescrNivelInt4, dbo.ArticuloNivelIntegra5.DescrNivelInt5 '
	+ 'FROM dbo.Articulo '
	+ 'LEFT JOIN dbo.ArticuloStock ON dbo.Articulo.Regis_arti=dbo.ArticuloStock.Regis_Arti '
	+ 'LEFT JOIN dbo.ArticuloNivelIntegra1 ON dbo.Articulo.Regis_NivelInt1=dbo.ArticuloNivelIntegra1.Regis_NivelInt1 '
	+ 'LEFT JOIN dbo.ArticuloNivelIntegra2 ON dbo.Articulo.Regis_NivelInt2=dbo.ArticuloNivelIntegra2.Regis_NivelInt2 '
	+ 'LEFT JOIN dbo.ArticuloNivelIntegra3 ON dbo.Articulo.Regis_NivelInt3=dbo.ArticuloNivelIntegra3.Regis_NivelInt3 '
	+ 'LEFT JOIN dbo.ArticuloNivelIntegra4 ON dbo.Articulo.Regis_NivelInt4=dbo.ArticuloNivelIntegra4.Regis_NivelInt4 '
	+ 'LEFT JOIN dbo.ArticuloNivelIntegra5 ON dbo.Articulo.Regis_NivelInt5=dbo.ArticuloNivelIntegra5.Regis_NivelInt5 '
	//+ 'WHERE dbo.Articulo.Regis_Arti BETWEEN 2750 AND 2780 '
	+ 'ORDER BY CodInternoArti;';

	// console.log(query);
	var data =  await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
  };



exports.doQuery = async function(req, res) {
	var query = req.body.query;
	// console.log(query);
	var data =  await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
  };
  
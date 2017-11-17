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
					} else {
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

					if ((keyType[c] === 'DecimalN' || keyType[c] === 'Int') && column.value === null)
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

exports.sqlQueryProductInventario = async function (req, res) {

	var codArtic = req.params.product_id;
	var desdeFecha = req.body.desdeFecha;
	var hastaFecha = req.body.hastaFecha;
	var dateFilterQuery = "";

	if (desdeFecha != undefined)
		dateFilterQuery += " AND amd.Fecha_MovArtiD >= " + desdeFecha + " ";
	if (hastaFecha != undefined)
		dateFilterQuery += " AND amd.Fecha_MovArtiD <= " + hastaFecha + " ";


	console.log(dateFilterQuery);

	var query = 'SELECT a.[Regis_arti], ' +
		'	a.[codinternoarti], ' +
		'	a.[descripcionarti], ' +
		'	c.[signostock], ' +
		'	amd.[fecha_movartid], ' +
		'	amd.[cantidad1_movartid], ' +
		'	amd.[preciomda1_movartid], ' +
		'	amd.[PrecioMda1_MovArtiD], ' +
		'	amcc.[razonsocialcli], ' +
		'	amd.[cantidad1_movartid], ' +
		'	c.[descripcion], ' +
		'	c.[signostock], ' +
		'	"CantMov" = CASE ' +
		'WHEN c.[signostock] = \'+\' THEN amd.[cantidad1_movartid] ' +
		'WHEN c.[signostock] = \'-\' THEN ( ' +
		'	amd.[cantidad1_movartid] * (-1) ' +
		') ' +
		'END ' +
		'FROM   dbo.[articulo] a ' +
		'INNER JOIN dbo.[articulomovimientodet] amd ' +
		'ON(a.regis_arti = amd.regis_arti ' +
		'		 AND a.regis_arti = ' + codArtic + dateFilterQuery + ') ' +
		'LEFT JOIN dbo.[comprobante] c ' +
		'ON(amd.regis_com = c.regis_com) ' +
		'LEFT JOIN (SELECT amc.regis_movartic, ' +
		'	cli.razonsocialcli ' +
		'	   FROM   dbo.[articulomovimientocab] amc ' +
		'			  LEFT JOIN dbo.[cliente] cli ' +
		'					 ON (amc.regis_cli = cli.regis_cli ) )  AS amcc ' +
		'ON(amd.regis_movartic = amcc.regis_movartic);';

	console.log(query);
	var data = await module.exports.sqlQuery(query);
	// console .log(data);
	res.json({ data });
};

exports.sqlQueryProductsInventario = async function (req, res) {


	var desdeFecha = req.body.desdeFecha;
	var hastaFecha = req.body.hastaFecha;
	var dateFilterQuery = "";
	if (desdeFecha != undefined && hastaFecha != undefined)
		dateFilterQuery += " WHERE amc.Fecha_MovArtiC BETWEEN " + desdeFecha + " AND " + hastaFecha + " ";
	else {
		if (desdeFecha != undefined)
			dateFilterQuery += " WHERE amc.Fecha_MovArtiC >= " + desdeFecha + " ";
		if (hastaFecha != undefined)
			dateFilterQuery += " WHERE amc.Fecha_MovArtiC <= " + hastaFecha + " ";
	}

	console.log(dateFilterQuery);


	var query = 'SELECT a.[Regis_Arti], MAX(a.[CodInternoArti]) AS CodInternoArti, ' +
		'MAX(a.DescrNivelInt4) AS DescrNivelInt4, ' +
		'MAX(a.[DescripcionArti]) AS DescripcionArti, ' +
		'MAX(a.[PrCto1Mda1_Arti]) AS PrCto1Mda1_Arti, ' +
		'MAX(a.[FechaCosteo_Arti]) AS FechaCosteo_Arti, ' +
		'SUM(CASE WHEN c.[SignoStock]  =  \'+\' THEN amd.[Cantidad1_MovArtiD] ELSE 0 END) AS IngresoStock, ' +
		'SUM(CASE WHEN c.[SignoStock]  =  \'-\' THEN amd.[Cantidad1_MovArtiD] ELSE 0 END) AS EgresoStock ' +
		'FROM dbo.[ArticuloMovimientoCab] amc ' +
		'LEFT JOIN dbo.[ArticuloMovimientoDet] amd ' +
		'ON (amd.Regis_MovArtiC = amc.Regis_MovArtiC) ' +
		'LEFT JOIN  dbo.[Comprobante] c ' +
		'ON (amc.Regis_Com = c.Regis_Com) ' +
		'LEFT JOIN ( SELECT Regis_Arti, CodInternoArti, DescripcionArti, PrCto1Mda1_Arti, FechaCosteo_Arti, ' +
		'dbo.ArticuloNivelIntegra4.DescrNivelInt4 ' +
		'FROM dbo.[Articulo] ' +
		'LEFT JOIN  dbo.ArticuloNivelIntegra4 ' +
		'ON (dbo.Articulo.Regis_NivelInt4=dbo.ArticuloNivelIntegra4.Regis_NivelInt4)) AS a  ' +
		'ON (amd.Regis_Arti = a.Regis_Arti) ' +
		dateFilterQuery +
		'GROUP BY a.[Regis_Arti];';

	console.log(query);
	var data = await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
};


exports.sqlQueryProductsPrices = async function (req, res) {
	var query = 'SELECT dbo.Articulo.Regis_Arti, dbo.Articulo.CodInternoArti, dbo.Articulo.PrCto1Mda1_Arti, dbo.Articulo.FechaCosteo_Arti, dbo.Articulo.DescripcionArti, dbo.ArticuloStock.Stock1_StkArti, dbo.ArticuloNivelIntegra1.DescrNivelInt1, dbo.ArticuloNivelIntegra2.DescrNivelInt2, dbo.ArticuloNivelIntegra3.DescrNivelInt3, dbo.ArticuloNivelIntegra4.DescrNivelInt4, dbo.ArticuloNivelIntegra5.DescrNivelInt5 ,dbo.ArticuloStPendiente.StPedido1_StPendi '
		+ 'FROM dbo.Articulo '
		+ 'LEFT JOIN dbo.ArticuloStock ON dbo.Articulo.Regis_arti=dbo.ArticuloStock.Regis_Arti '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra1 ON dbo.Articulo.Regis_NivelInt1=dbo.ArticuloNivelIntegra1.Regis_NivelInt1 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra2 ON dbo.Articulo.Regis_NivelInt2=dbo.ArticuloNivelIntegra2.Regis_NivelInt2 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra3 ON dbo.Articulo.Regis_NivelInt3=dbo.ArticuloNivelIntegra3.Regis_NivelInt3 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra4 ON dbo.Articulo.Regis_NivelInt4=dbo.ArticuloNivelIntegra4.Regis_NivelInt4 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra5 ON dbo.Articulo.Regis_NivelInt5=dbo.ArticuloNivelIntegra5.Regis_NivelInt5 '
		+ 'LEFT JOIN dbo.ArticuloStPendiente ON dbo.Articulo.Regis_Arti=dbo.ArticuloStPendiente.Regis_Arti '
		//+ 'WHERE dbo.Articulo.Regis_Arti BETWEEN 2750 AND 2780 '
		+ 'ORDER BY CodInternoArti;';

	// console.log(query);
	var data = await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
};


exports.sqlQueryProductsStock = async function (req, res) {
	var query = 'SELECT dbo.Articulo.Regis_Arti, dbo.Articulo.CodInternoArti, dbo.Articulo.DescripcionArti, dbo.ArticuloStock.Stock1_StkArti, dbo.ArticuloNivelIntegra1.DescrNivelInt1, dbo.ArticuloNivelIntegra2.DescrNivelInt2, dbo.ArticuloNivelIntegra3.DescrNivelInt3, dbo.ArticuloNivelIntegra4.DescrNivelInt4, dbo.ArticuloNivelIntegra5.DescrNivelInt5 ,dbo.ArticuloStPendiente.StPedido1_StPendi, pend.pendiente '
		+ 'FROM dbo.Articulo '
		+ 'LEFT JOIN  (SELECT SUM(OCDet.Cant1_OrdCpDet) AS pendiente, OCDet.Regis_Arti '
		+ 'FROM dbo.OrdenCompraDet OCDet '
		+ 'WHERE NOT ( OCDet.Cant1_OrdCpDet = OCDet.CanRec1_OrdCpDet) '
		+ 'GROUP BY (OCDet.Regis_Arti)) pend '
		+ 'ON (dbo.Articulo.Regis_Arti = pend.Regis_Arti) '
		+ 'LEFT JOIN dbo.ArticuloStock ON dbo.Articulo.Regis_arti=dbo.ArticuloStock.Regis_Arti '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra1 ON dbo.Articulo.Regis_NivelInt1=dbo.ArticuloNivelIntegra1.Regis_NivelInt1 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra2 ON dbo.Articulo.Regis_NivelInt2=dbo.ArticuloNivelIntegra2.Regis_NivelInt2 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra3 ON dbo.Articulo.Regis_NivelInt3=dbo.ArticuloNivelIntegra3.Regis_NivelInt3 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra4 ON dbo.Articulo.Regis_NivelInt4=dbo.ArticuloNivelIntegra4.Regis_NivelInt4 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra5 ON dbo.Articulo.Regis_NivelInt5=dbo.ArticuloNivelIntegra5.Regis_NivelInt5 '
		+ 'LEFT JOIN dbo.ArticuloStPendiente ON dbo.Articulo.Regis_Arti=dbo.ArticuloStPendiente.Regis_Arti '
		//+ 'WHERE dbo.Articulo.Regis_Arti BETWEEN 2750 AND 2780 '
		+ 'ORDER BY CodInternoArti;';

	// console.log(query);
	var data = await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
};

exports.sqlQueryProductEnCamino = async function (req, res) {
	var productid = req.params.product_id;
	
	var query = 'SELECT OCDet.Cant1_OrdCpDet AS pendiente, OCDet.Regis_Arti, OCDet.FechaEntrega_OrdCpDet AS fehcaEntrega, OCDet.CanRec1_OrdCpDet AS recibido '
		+ 'FROM dbo.OrdenCompraDet OCDet '
		+ 'WHERE (OCDet.Regis_arti = ' + productid + ') AND NOT ( OCDet.Cant1_OrdCpDet = OCDet.CanRec1_OrdCpDet) '
		;

	// console.log(query);
	var data = await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
};

exports.sqlQueryProductsUtility = async function (req, res) {
	var query =  ' SELECT dbo.Articulo.Regis_Arti, dbo.Articulo.CodInternoArti, dbo.Articulo.PrCto1Mda1_Arti, dbo.Articulo.FechaCosteo_Arti, dbo.Articulo.DescripcionArti, dbo.ArticuloStock.Stock1_StkArti, dbo.ArticuloNivelIntegra1.DescrNivelInt1, dbo.ArticuloNivelIntegra2.DescrNivelInt2, dbo.ArticuloNivelIntegra3.DescrNivelInt3, dbo.ArticuloNivelIntegra4.DescrNivelInt4, dbo.ArticuloNivelIntegra5.DescrNivelInt5 ,dbo.ArticuloStPendiente.StPedido1_StPendi  ' 
		+  '  , pre.PrecioLista, pre.PrecioGremio  ' 
		+  ' FROM dbo.Articulo  ' 
		+  ' LEFT JOIN dbo.ArticuloStock ON dbo.Articulo.Regis_arti=dbo.ArticuloStock.Regis_Arti  ' 
		+  ' LEFT JOIN dbo.ArticuloNivelIntegra1 ON dbo.Articulo.Regis_NivelInt1=dbo.ArticuloNivelIntegra1.Regis_NivelInt1  ' 
		+  ' LEFT JOIN dbo.ArticuloNivelIntegra2 ON dbo.Articulo.Regis_NivelInt2=dbo.ArticuloNivelIntegra2.Regis_NivelInt2  ' 
		+  ' LEFT JOIN dbo.ArticuloNivelIntegra3 ON dbo.Articulo.Regis_NivelInt3=dbo.ArticuloNivelIntegra3.Regis_NivelInt3  ' 
		+  ' LEFT JOIN dbo.ArticuloNivelIntegra4 ON dbo.Articulo.Regis_NivelInt4=dbo.ArticuloNivelIntegra4.Regis_NivelInt4  ' 
		+  ' LEFT JOIN dbo.ArticuloNivelIntegra5 ON dbo.Articulo.Regis_NivelInt5=dbo.ArticuloNivelIntegra5.Regis_NivelInt5  ' 
		+  ' LEFT JOIN dbo.ArticuloStPendiente ON dbo.Articulo.Regis_Arti=dbo.ArticuloStPendiente.Regis_Arti  ' 
		//+  ' WHERE dbo.Articulo.Regis_Arti BETWEEN 2750 AND 2780  ' 
		+  ' LEFT JOIN (SELECT lpl.PrecioLista, lpg.PrecioGremio, a.Regis_Arti  ' 
		+  ' FROM dbo.Articulo a  ' 
		+  ' LEFT JOIN (  SELECT apv.PrecioVta1_PreArti AS PrecioGremio, apv.Regis_Arti  ' 
		+  ' FROM dbo.Articulo a  ' 
		+  ' LEFT JOIN dbo.ArticuloPrecioVta apv  ' 
		+  ' ON (a.Regis_Arti = apv.Regis_Arti AND apv.Regis_ListaPrec = 30) ) AS lpg  ' 
		+  ' ON (a.Regis_Arti = lpg.Regis_Arti)  ' 
		+  ' LEFT JOIN (  SELECT apv.PrecioVta1_PreArti AS PrecioLista, apv.Regis_Arti  ' 
		+  ' FROM dbo.Articulo a  ' 
		+  ' LEFT JOIN dbo.ArticuloPrecioVta apv  ' 
		+  ' ON (a.Regis_Arti = apv.Regis_Arti AND apv.Regis_ListaPrec = 1) ) AS lpl'
		+  ' ON (a.Regis_Arti = lpl.Regis_Arti)) AS pre  ' 
		+  ' ON (pre.Regis_Arti = dbo.Articulo.Regis_Arti)  ' 
		+  ' ORDER BY CodInternoArti;';

	// console.log(query);
	var data = await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
};

exports.sqlQueryClientes = async function (req, res) {
	var query =  ' SELECT cli.Regis_Cli, cli.CodigoCli, cli.RazonSocialCli, cli.CalleCli, cli.NumeroCli, cli.DeptoCli, cli.BarrioCli, cli.LocalidadCli, cli.CodigoPostalCli, cli.Telefono1Cli, cli.Telefono2Cli, cli.Telefono3Cli, cli.EmailCli, cli.EmailCli, cli.PaginaWebCli, cli.CuitCli, cli.HorarioCli, cli.FechaUltimaFacCli, cli.CodProveedorCli  ' 
		+  ' FROM dbo.Cliente cli ' 
		+  ' ORDER BY RazonSocialCli;';

	// console.log(query);
	var data = await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
};

exports.sqlQueryCliente = async function (req, res) {
	var cliente = req.params.cliente_id;
	var query =  ' SELECT cli.Regis_Cli, cli.CodigoCli, cli.RazonSocialCli, cli.CalleCli, cli.NumeroCli, cli.DeptoCli, cli.BarrioCli, cli.LocalidadCli, cli.CodigoPostalCli, cli.Telefono1Cli, cli.Telefono2Cli, cli.Telefono3Cli, cli.EmailCli, cli.EmailCli, cli.PaginaWebCli, cli.CuitCli, cli.HorarioCli, cli.FechaUltimaFacCli, cli.CodProveedorCli  ' 
		+  ' FROM dbo.Cliente cli ' 
		+  ' WHERE (cli.Regis_Cli= '+ cliente + ' ) '
		+  ' ORDER BY RazonSocialCli;';

	// console.log(query);
	var data = await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
};

exports.doQuery = async function (req, res) {
	var query = req.body.query;
	console.log(query);
	var data = await module.exports.sqlQuery(query);
	// console.log(data);
	res.json({ data });
};

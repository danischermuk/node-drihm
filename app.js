/****************************DEPENDENCIAS Y MODULOS****************************/
var express         = require('express');
var app             = express();
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var methodOverride  = require("method-override");
var mongoose        = require('mongoose');
var Agenda          = require('agenda');
var passport        = require('passport');
var server          = require('http').Server(app);
var io              = require('socket.io')(server);

var debug           = require('debug')('nodeangular:server');

var Connection      = require('tedious').Connection;
var Request         = require('tedious').Request;
var TYPES           = require('tedious').TYPES;


// Definicion del path
var application_root = __dirname;

/****************************MODELOS (SCHEMAS)****************************/


// Route del index
var routes          = require('./routes/index');

/****************************CONTROLLERS****************************/
// Routes de la API
var api             = require('./controllers/api');
// Inicialización de la aplicación
var Init            = require('./controllers/init');

var emitIO            = require('./controllers/emitIO');
emitIO.init(io);


/****************************APLICACION****************************/
 // Declaracion de la aplicacion
app.disable('x-powered-by');
 // Use the passport package in our application
app.use(passport.initialize());
// view engine setup
app.set     ('views', path.join(__dirname, 'views'));
app.engine  ("html", require("ejs").renderFile);
app.set     ('view engine', 'html');
 
app.use(favicon('public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Direccion de los paquetes de BOWER
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Direccion de las Routes
app.use('/', routes);
app.use('/api', api);

// Inicializamos la aplicación
Init.initMongoDB();

var agenda      = new Agenda({db: {address: 'localhost:27017/agenda-example'}});
exports.agenda  = agenda;

agenda.define('greet the world1', function(job, done) {
	job.attrs.data.num = job.attrs.data.num+1;
  console.log(job.attrs.data.num, 'hello world!');
  done();
});


agenda.define('view jobs', function(job, done) {
  console.log("JOBS DE AGENDA");
	agenda.jobs({}, function(err, jobs) {
	  console.log(jobs);
	});
	done();
});

agenda.on('ready', function() {
	agenda.cancel({}, function(err, numRemoved) {
    console.log(numRemoved + " Removed from Agenda");
  });
 	// agenda.every('10 seconds', 'greet the world1', {num: 0});

  

  var when = new Date(2017, 2, 23, 11, 52, 30, 0);
  
  agenda.start();
  
  agenda.jobs({}, function(err, jobs) {
    console.log(jobs);
  });
	
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
 
/// error handlers
 
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
 
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
 





var port = normalizePort(process.env.PORT || '3333');
app.set('port', port);


io.on('connection', function(client){
  console.log("io connection");
  client.on('event', function(data){console.log("io EVENT" + data);client.emit('messages', 'mensaje del socket');});
  client.on('disconnect', function(){console.log("io DISconnection");});

});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}



// Create connection to database
var config = {
  userName: 'sa', // update me
  password: '1', // update me
  server: 'SRV-DRIHM',
  options: {
      database: 'DRIHM'
  }
}
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');
    
    console.log('Reading rows from the Table...');
    
    // Read all rows from table
    request = new Request(
      'SELECT dbo.Articulo.Regis_Arti, dbo.Articulo.CodInternoArti, dbo.Articulo.DescripcionArti, dbo.ArticuloStock.Stock1_StkArti '
    + 'FROM dbo.Articulo '
    + 'INNER JOIN dbo.ArticuloStock ON dbo.Articulo.Regis_arti=dbo.ArticuloStock.Regis_Arti '
    + 'WHERE dbo.Articulo.Regis_Arti '
    + 'BETWEEN 1470 AND 1500 '
    + 'ORDER BY CodInternoArti;',
    function(err, rowCount, rows) {
    if (err) {
        console.log(err);
    } else {
      console.log(data);
      console.log(rowCount + ' row(s) returned!');
    }

    });

    //Print the rows read
    var r=0 ,c =0;
    var result = "";
    var keys = [];
    var values = [];
    var line = {};
    var data = [];
    request.on('row', function(columns) {
      c=0;
      line = {};
      r++;
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
              line[keys[c]] = column.value;
              result += column.value + " ";
            }
            c++;
        });
        data.push(line);
        console.log(result);
        result = "";  
        
    });

    
    request.on('columnMetadata', function (columns) { 
      columns.forEach(function(column) {
        if (column.value === null) {
            console.log('NULL');
        } else {
            result += column.colName + " ";
            keys.push(column.colName);
        }
    });
    console.log(result);
    result = "";  
    });

    // Execute SQL statement
    connection.execSql(request);

    
  }
});






module.exports = app;
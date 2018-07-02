// Express Router
var express = require('express');
var router = express.Router();
// Controllers
var authController = require('./auth');
var userController = require('./user');
var sqlController = require('./tedious');
var agendaAPIController = require('./api/agenda');

// Define Routes

/**********************************************************
						USER API
***********************************************************/

router.route('/user')
	.get(authController.isAuthenticated, userController.getUsers)
	.post(authController.isAuthenticated, userController.postUser);

router.route('/user/me')
	.get(authController.isAuthenticated, userController.getReqUser);


router.route('/user/:user_id')
	.get(authController.isAuthenticated, userController.getUser)
	.put(authController.isAuthenticated, userController.updateUser)
	.delete(authController.isAuthenticated, userController.deleteUser);

router.route('/user/:user_id/menu')
	.get(authController.isAuthenticated, userController.getUserMenu);

/**********************************************************
						AGENDA API
***********************************************************/

router.route('/agenda')
	.get(authController.isAuthenticated, agendaAPIController.getJobsAPI);


/**********************************************************
						SQL API
***********************************************************/

router.route('/sql')
	.post(authController.isAuthenticated, sqlController.doQuery);

router.route('/sql/products/stock')
	.get(authController.isAuthenticated, sqlController.sqlQueryProductsStock);

router.route('/sql/products/encamino/:product_id')
	.get(authController.isAuthenticated, sqlController.sqlQueryProductEnCamino);

router.route('/sql/products/prices')
	.get(authController.isAuthenticated, sqlController.sqlQueryProductsPrices);

router.route('/sql/products/utility')
	.get(authController.isAuthenticated, sqlController.sqlQueryProductsUtility);

router.route('/sql/products/movimiento')
	.post(authController.isAuthenticated, sqlController.sqlQueryProductsInventario);

router.route('/sql/products/movimiento/:product_id')
	.post(authController.isAuthenticated, sqlController.sqlQueryProductInventario);

router.route('/sql/clientes/')
	.get(authController.isAuthenticated, sqlController.sqlQueryClientes);

router.route('/sql/clientes/:cliente_id')
	.get(authController.isAuthenticated, sqlController.sqlQueryCliente);

router.route('/sql/cliente/transactions/:cliente_id')
	.get(authController.isAuthenticated, sqlController.sqlQueryClienteTransactions);

router.route('/sql/comprobante/:transaction_id')
	.get(authController.isAuthenticated, sqlController.sqlQueryTransaction);

	

module.exports = router;
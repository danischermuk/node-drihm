// Express Router
var express   		= require('express');
var router    		= express.Router();
// Controllers
var authController 		= require('./auth'); 
var userController 		= require('./user');
var agendaAPIController = require('./api/agenda');

// Define Routes

/**********************************************************
						USER API
***********************************************************/

router.route('/user')
	.get 	(authController.isAuthenticated, userController.getUsers)
	.post 	(authController.isAuthenticated, userController.postUser);

router.route('/user/me')
	.get 	(authController.isAuthenticated, userController.getReqUser);


router.route('/user/:user_id')
	.get 	(authController.isAuthenticated, userController.getUser)
	.put 	(authController.isAuthenticated, userController.updateUser)
	.delete (authController.isAuthenticated, userController.deleteUser);
	
router.route('/user/:user_id/menu')
	.get 	(authController.isAuthenticated, userController.getUserMenu);

/**********************************************************
						AGENDA API
***********************************************************/

router.route('/agenda')
	.get 	(authController.isAuthenticated, agendaAPIController.getJobsAPI);



module.exports = router;
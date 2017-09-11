var express = require('express');
var router = express.Router();

var passport = require('passport')
var authController = require('../controllers/auth.js');

router.route('/')
  .get  (authController.isAuthenticated, function(req, res) { res.render('index', { user: req.user}); });

module.exports = router;
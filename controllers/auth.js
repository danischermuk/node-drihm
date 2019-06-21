// Load required packages
var passport        = require('passport');
var BasicStrategy   = require('passport-http').BasicStrategy;
var User            = require('../models/user');



passport.use('basic', new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { console.log("ERROR", err);return callback(err); }

      // No user found with that username
      if (!user) { console.log("No User", err);return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { console.log("Pass Not Verifyied", err);return callback(err); }

        // Password did not match
        if (!isMatch) { console.log("Pass Mismatch", err);return callback(null, false); }

        // Success
        console.log("Logged In!");
        return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });

exports.requireRole = function(role) {
  return function (req, res, next) {
    console.log("ROL - " + role);
    console.log("USER - " + req.user);
    if(role.indexOf(req.user.role) > -1)
      next();
    else
      response.status(403).json({message: "Forbidden"}); // user is forbidden
  }
};
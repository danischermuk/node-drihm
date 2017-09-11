// Load required packages
var passport        = require('passport');
var BasicStrategy   = require('passport-http').BasicStrategy;
var User            = require('../models/user');



passport.use('basic', new BasicStrategy(
  function(username, password, callback) {
    console.log(username);
    console.log(password);
    User.findOne({ username: username }, function (err, user) {
      if (err) { console.log("1");return callback(err); }

      // No user found with that username
      if (!user) { console.log("2");return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { console.log("3");return callback(err); }

        // Password did not match
        if (!isMatch) { console.log("4");return callback(null, false); }

        // Success
        console.log("5");
        return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });
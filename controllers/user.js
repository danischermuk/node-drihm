// Modules
var mongoose  = require('mongoose');
// MongoDB models
var User      = mongoose.model('User');

// Create endpoint /api/user/ for GET
exports.getUsers = function(req, res) {
  // Find all Users
  User.find(function(err, user) {
    if (err)
      res.send(err);

    res.json(user);
  });
};

// Create endpoint /api/user for POSTS
exports.postUser = function(req, res) {
  var user = new User();
  // Set the user properties that came from the POST data
  user.name     = req.body.name;
  user.username = req.body.username;
  user.password = req.body.password;
  user.email    = req.body.email;
  user.admin    = req.body.admin;

  // Save the user and check for errors
  user.save(function(err) {
    if (err)
      res.send(err);
    else
      res.json({ message: 'user added to the db!', data: user });
  });
};


// Create endpoint /api/user/:user_id for GET
exports.getUser = function(req, res) {
  console.log(req.params);
  User.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);
    else
      res.json(user);
  });
};

exports.updateUser = function(req, res) {
  // Use the Beer model to find a specific beer
  User.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);
    // Aplicar los cambios
    user.name     = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;
    user.email    = req.body.email;
    user.admin    = req.body.admin;
    // Save the beer and check for errors
    user.save(function(err) {
      if (err)
        res.send(err);
      else
        res.json(user);
    });
  }); 
};

// Create endpoint /api/user/:user_id for DELETE
exports.deleteUser = function(req, res) {
  // Use the Beer model to find a specific beer and remove it
  User.findByIdAndRemove(req.params.user_id , function(err) {
    if (err)
      res.send(err);
    else
      res.json({ message: 'User removed from the db!' });
  });
};

// Create endpoint /api/user/:user_id/menu for GET
exports.getUserMenu = function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);
    else
      if(user.admin === true)
      {
        res.send([{  "name": "View Profile",
          "url":  "/profile"}, 
          { 
            "name": "Advanced Settings",
            "url":  "/advsettings"
          }]);
      }
      else
      {
        res.send( [{  "name": "View Profile", 
          "url":  "/profile"
        }]);
      }
    });
};

exports.getReqUser = function(req, res) {
  if(req.user)
    res.send(req.user);
  else
    res.send();
}
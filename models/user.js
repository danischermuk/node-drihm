var mongoose 	= require('mongoose');  
var Schema   	= mongoose.Schema;
var bcrypt 		= require('bcrypt-nodejs');

var userSchema = new Schema({  
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  admin: Boolean
});

// Execute before each user.save() call
userSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

// Implement the VerifyPassword Method
userSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);  
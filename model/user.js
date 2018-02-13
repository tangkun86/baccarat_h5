var mongoose = require('mongoose');
var userSchema = require('../schema/user');
var userModel = mongoose.model('users', userSchema);
module.exports = userModel;
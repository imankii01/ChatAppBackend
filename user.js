const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  user_id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  age: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

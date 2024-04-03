const mongoose = require('mongoose');

// Define the schema with specified collection name
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  timestamp: { type: Date, default: Date.now }
}, { collection: 'users' });

// Define the model
module.exports = mongoose.model('User', userSchema);
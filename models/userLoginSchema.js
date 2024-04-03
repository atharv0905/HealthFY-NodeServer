const mongoose = require('mongoose');

// Define the schema with specified collection name
const userLoginSchema = new mongoose.Schema({
    username: String,
    timestamp: { type: Date, default: Date.now }
}, { collection: 'user_login' });

// Define the model
module.exports = mongoose.model('UserLogin', userLoginSchema);
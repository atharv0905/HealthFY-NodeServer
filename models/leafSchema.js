const mongoose = require('mongoose');

// Define the schema with specified collection name
const leafSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  status: String,
  imagePath: String,
  username: String,
  region: String,
  detectedAt: { type: Date, default: Date.now }
}, { collection: 'leaves_data' });

module.exports = mongoose.model('Leaves', leafSchema);
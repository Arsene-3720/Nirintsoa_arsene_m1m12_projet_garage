const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: String,
  image: String
  
});

module.exports = mongoose.model('Service', serviceSchema);

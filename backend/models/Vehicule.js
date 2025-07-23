const mongoose = require('mongoose');

const vehiculeSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  marque: String,
  modele: String,
  immatriculation: { type: String, unique: true },
  annee: Number
});

module.exports = mongoose.model('Vehicule', vehiculeSchema);

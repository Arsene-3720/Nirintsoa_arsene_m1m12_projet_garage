const mongoose = require('mongoose');

const sousServiceSchema = new mongoose.Schema({
  nom: { type: String, required: true },                 // Ex : "Vidange"
  description: { type: String },                         // Détail du sous-service
  image: { type: String },                               // Image optionnelle du sous-service
  dureeEstimee: { type: Number, required: true },       // Durée en minutes (ex : 60)
  prix: { type: Number, required: true },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true                                       // Lien vers le Service parent
  }
});

module.exports = mongoose.model('SousService', sousServiceSchema);

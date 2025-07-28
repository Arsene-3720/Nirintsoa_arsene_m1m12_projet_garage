const mongoose = require('mongoose');

const mecanicienSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true }, // stocké hashé !
  telephone: { type: String },
  specialites: [{ type: String }],
  photo: { type: String }, // Exemple : 'uploads/photos/nom_fichier.jpg' ou URL complète
  dateCreation: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Mecanicien', mecanicienSchema);

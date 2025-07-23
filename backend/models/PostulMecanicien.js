const mongoose = require('mongoose');

const postulationMecanicienSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String },
  email: { type: String, required: true, unique: true },
  telephone: { type: String },
  specialites: [{ type: String }],  // liste des spécialités
  experience: { type: String },
  cv: { type: String }, // chemin ou URL vers le CV uploadé
  statut: {
    type: String,
    enum: ['en attente', 'accepté', 'rejeté'],
    default: 'en attente'
  },
  datePostulation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PostulationMecanicien', postulationMecanicienSchema);

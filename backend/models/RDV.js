const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule', required: true },
  sousService: { type: mongoose.Schema.Types.ObjectId, ref: 'SousService', required: true },
  mecaniciens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mecanicien' }],

  date: { type: Date, required: true },
  heureDebut: { type: String, required: function() { return !this.urgence; } },
  heureFin: { type: String, required: function() { return !this.urgence; } },

  urgence: { type: Boolean, default: false },
  descriptionUrgence: { type: String, required: function() { return this.urgence; } },

  localisation: { type: String }, // ← intervention à domicile si besoin

  statut: {
    type: String,
    enum: ['en attente', 'confirmé', 'urgent_confirmé', 'terminé', 'annulé'],
    default: 'en attente'
  },

  commentaireClient: String,
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RendezVous', rendezVousSchema);

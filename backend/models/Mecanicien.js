const mongoose = require('mongoose');

const mecanicienSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  telephone: { type: String },
  specialites: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
      nomService: { type: String }
    }
  ],
  photo: { type: String },
  dateCreation: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mecanicien', mecanicienSchema);

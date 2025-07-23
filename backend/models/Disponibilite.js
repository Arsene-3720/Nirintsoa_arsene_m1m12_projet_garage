const mongoose = require('mongoose');

const disponibiliteSchema = new mongoose.Schema({
  mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: 'Mecanicien', required: true },
  date: { type: Date, required: true },
  heureDebut: { type: String, required: true }, // ex: "08:00"
  heureFin: { type: String, required: true },   // ex: "10:00"
  estLibre: { type: Boolean, default: true }
});

module.exports = mongoose.model('Disponibilite', disponibiliteSchema);

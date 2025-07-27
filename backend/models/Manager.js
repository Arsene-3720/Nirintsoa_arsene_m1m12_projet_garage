// models/Manager.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const managerSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  telephone: String,
  type: {
    type: String,
    enum: ['global', 'client-mecanicien'],
    required: true
  }
});

// Hachage du mot de passe
managerSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  next();
});

module.exports = mongoose.model('Manager', managerSchema);

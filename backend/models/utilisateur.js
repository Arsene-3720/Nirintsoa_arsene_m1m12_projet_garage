// models/utilisateur.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const utilisateurSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  role: {
    type: String,
    enum: ['client', 'manager-global', 'manager-client', 'mecanicien'],
    required: true
  },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'roleModel' },
  roleModel: { type: String, required: true, enum: ['Client', 'Manager', 'Mecanicien'] }
});

// 🔒 Hash du mot de passe
utilisateurSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  next();
});

// 🔑 Comparaison pour le login
utilisateurSchema.methods.comparePassword = function (mdp) {
  return bcrypt.compare(mdp, this.motDePasse);
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);

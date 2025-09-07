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

// 🔒 Hash du mot de passe SEULEMENT s'il n'est pas déjà hashé
utilisateurSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  
  // ⚠️ CORRECTION : Vérifier si le mot de passe est déjà hashé
  // Un hash bcrypt commence toujours par $2b$, $2a$, ou $2y$
  if (this.motDePasse.startsWith('$2b$') || 
      this.motDePasse.startsWith('$2a$') || 
      this.motDePasse.startsWith('$2y$')) {
    // Le mot de passe est déjà hashé, ne pas re-hasher
    console.log('Mot de passe déjà hashé, pas de re-hashage');
    return next();
  }
  
  // Le mot de passe n'est pas hashé, on le hashe
  console.log('Hashage du mot de passe par le pre-save hook');
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  next();
});

// 🔑 Comparaison pour le login
utilisateurSchema.methods.comparePassword = function (mdp) {
  return bcrypt.compare(mdp, this.motDePasse);
};

// ✅ Correction pour overwriteModelError
module.exports = mongoose.models.Utilisateur || mongoose.model('Utilisateur', utilisateurSchema);
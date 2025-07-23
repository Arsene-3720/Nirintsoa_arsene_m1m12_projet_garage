const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    nom: String,
    prenom: String, 
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    type: { type: String, enum: ['global', 'client-mecanicien'], required: true },
    role: {
    type: String,
    enum: ['manager-global', 'manager-client'],
    required: true
  }
});

module.exports = mongoose.model('Manager', managerSchema);

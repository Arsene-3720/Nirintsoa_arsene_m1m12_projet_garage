const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: { type: String, required: true, unique: true },
    dateNaissance: Date,
    telephone: String,
    motDePasse: { type: String, required: true },
    informations: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InformationClient',
    },
    role: {
    type: String,
    default: 'client',
    }
});

module.exports = mongoose.model('Client', clientSchema);

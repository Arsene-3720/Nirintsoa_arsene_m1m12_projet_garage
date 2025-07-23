const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  contenu: String,
  note: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commentaire', commentaireSchema);

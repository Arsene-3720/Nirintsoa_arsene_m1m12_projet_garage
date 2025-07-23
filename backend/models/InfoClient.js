const mongoose = require('mongoose');

const infoClientSchema = new mongoose.Schema({
  adresse: String,
  codePostal: String,
  ville: String,
  autresInfos: String
});

module.exports = mongoose.model('InformationClient', infoClientSchema);

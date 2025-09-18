// migrateSpecialites.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/garage');

const Service = mongoose.model('Service', new mongoose.Schema({
  nom: String
}));

const SousService = mongoose.model('SousService', new mongoose.Schema({
  nom: String,
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }
}));

// ⚠️ Le nouveau schema Mecanicien
const Mecanicien = mongoose.model('Mecanicien', new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  specialites: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
      nomService: String
    }
  ]
}));

async function migrateSpecialites() {
  const mecaniciens = await Mecanicien.find();
  const sousServices = await SousService.find().populate('service');

  for (let mec of mecaniciens) {
    const nouvellesSpecialites = mec.specialites.map(nomSpecialite => {
      const ss = sousServices.find(s => s.nom === nomSpecialite);
      if (!ss) return null;
      return { serviceId: ss.service._id, nomService: ss.service.nom };
    }).filter(s => s !== null);

    mec.specialites = nouvellesSpecialites;
    await mec.save();
    console.log(`✅ Mécanicien ${mec.nom} mis à jour`);
  }

  console.log("Migration terminée !");
  mongoose.disconnect();
}

migrateSpecialites().catch(err => console.error(err));

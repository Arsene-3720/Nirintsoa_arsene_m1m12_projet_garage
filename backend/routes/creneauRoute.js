// routes/creneaux.routes.js
const express = require('express');
const router = express.Router();
const Mecanicien = require('../models/Mecanicien');
const Disponibilite = require('../models/Disponibilite');
const RendezVous = require('../models/RendezVous');
const SousService = require('../models/SousService');

// 👉 Récupérer les créneaux disponibles pour un sous-service à une date
router.get('/:sousServiceId', async (req, res) => {
  try {
    const { sousServiceId } = req.params;
    const { date } = req.query; // format: 'YYYY-MM-DD'

    if (!date) return res.status(400).json({ error: 'La date est requise' });

    // 1️⃣ Récupérer le sous-service pour connaître sa durée
    const sousService = await SousService.findById(sousServiceId);
    if (!sousService) return res.status(404).json({ error: 'Sous-service introuvable' });

    // 2️⃣ Récupérer les mécaniciens capables de faire ce sous-service
    const mecaniciens = await Mecanicien.find({ specialites: sousService.nom });

    if (!mecaniciens.length) return res.json([]); // aucun créneau si pas de mécanicien

    // 3️⃣ Pour chaque mécanicien, récupérer ses disponibilités ce jour-là
    let tousCreneaux = [];

    for (const mec of mecaniciens) {
      const disponibilites = await Disponibilite.find({
        mecanicien: mec._id,
        date: new Date(date),
        estLibre: true
      });

      // Ajouter chaque créneau
      disponibilites.forEach(d => {
        tousCreneaux.push({
          debut: d.heureDebut,
          fin: d.heureFin
        });
      });
    }

    // 4️⃣ Supprimer les créneaux déjà pris par un rendez-vous pour ce sous-service
    const rendezVousExistants = await RendezVous.find({
      sousService: sousServiceId,
      date: new Date(date)
    });

    const creneauxFiltres = tousCreneaux.filter(c => {
      return !rendezVousExistants.some(rv =>
        (c.debut < rv.heureFin && c.fin > rv.heureDebut) // overlap
      );
    });

    // 5️⃣ Supprimer les doublons (plusieurs mécaniciens)
    const uniqueCreneaux = Array.from(new Set(creneauxFiltres.map(JSON.stringify))).map(JSON.parse);

    res.json(uniqueCreneaux);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

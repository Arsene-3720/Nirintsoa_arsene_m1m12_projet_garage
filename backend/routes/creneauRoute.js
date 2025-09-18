// routes/creneaux.js
const express = require('express');
const router = express.Router();
const SousService = require('../models/SousService');
const Mecanicien = require('../models/Mecanicien');
const RendezVous = require('../models/RDV');

// GET /api/creneaux/:sousServiceId?date=YYYY-MM-DD
router.get('/:sousServiceId', async (req, res) => {
  try {
    const { sousServiceId } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: 'La date est requise' });

    // 1️⃣ Récupérer le sous-service + son service parent
    const sousService = await SousService.findById(sousServiceId).populate('service');
    if (!sousService) return res.status(404).json({ error: 'Sous-service introuvable' });

    const service = sousService.service;
    if (!service) return res.status(404).json({ error: 'Service parent introuvable' });

    // 2️⃣ Vérifier que ce n’est pas dimanche
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0) return res.json([]);

    // 3️⃣ Récupérer les mécaniciens qui ont ce service dans leur spécialité
    const mecaniciens = await Mecanicien.find({
      specialites: { $in: [service.nom] }
    });

    if (!mecaniciens.length) return res.json([]);

    const ouverture = 8 * 60;   // 08:00
    const fermeture = 18 * 60;  // 18:00
    const duree = sousService.dureeEstimee; // en minutes

    let tousCreneaux = [];

    for (const mec of mecaniciens) {
      // RDV existants ce jour-là
      const rdvs = await RendezVous.find({
        mecaniciens: mec._id,
        date: new Date(date)
      });

      for (let debutMin = ouverture; debutMin + duree <= fermeture; debutMin += duree) {
        const finMin = debutMin + duree;

        const debutStr = `${String(Math.floor(debutMin/60)).padStart(2,'0')}:${String(debutMin%60).padStart(2,'0')}`;
        const finStr = `${String(Math.floor(finMin/60)).padStart(2,'0')}:${String(finMin%60).padStart(2,'0')}`;

        const estLibre = !rdvs.some(rv => !(finStr <= rv.heureDebut || debutStr >= rv.heureFin));
        if (estLibre) {
          tousCreneaux.push({ debut: debutStr, fin: finStr });
        }
      }
    }

    // Supprimer doublons
    const uniqueCreneaux = Array.from(new Set(tousCreneaux.map(JSON.stringify))).map(JSON.parse);

    res.json(uniqueCreneaux);

  } catch (err) {
    console.error("Erreur route /creneaux :", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;



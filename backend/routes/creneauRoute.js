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

    // Récupérer le sous-service pour connaître sa durée
    const sousService = await SousService.findById(sousServiceId);
    if (!sousService) return res.status(404).json({ error: 'Sous-service introuvable' });

    // Pas de créneaux le dimanche
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0) return res.json([]);

    // Trouver les mécaniciens capables de faire ce sous-service
    const mecaniciens = await Mecanicien.find({ specialites: sousService.nom });
    if (!mecaniciens.length) return res.json([]);

    const ouverture = 8 * 60;  // 08:00 en minutes
    const fermeture = 18 * 60; // 18:00 en minutes
    const duree = sousService.dureeEstimee; // en minutes

    let tousCreneaux = [];

    for (const mec of mecaniciens) {
      // Récupérer les rendez-vous existants pour ce mécanicien à cette date
      const rdvs = await RendezVous.find({
        mecaniciens: mec._id,
        date: new Date(date)
      });

      // Générer les créneaux
      for (let debutMin = ouverture; debutMin + duree <= fermeture; debutMin += duree) {
        const finMin = debutMin + duree;
        const debutStr = `${String(Math.floor(debutMin/60)).padStart(2,'0')}:${String(debutMin%60).padStart(2,'0')}`;
        const finStr = `${String(Math.floor(finMin/60)).padStart(2,'0')}:${String(finMin%60).padStart(2,'0')}`;

        // Vérifier si le créneau est libre (pas de rendez-vous existant)
        const estLibre = !rdvs.some(rv => !(finStr <= rv.heureDebut || debutStr >= rv.heureFin));
        if (estLibre) {
          tousCreneaux.push({ debut: debutStr, fin: finStr });
        }
      }
    }

    // Supprimer les doublons si plusieurs mécaniciens ont le même créneau
    const uniqueCreneaux = Array.from(new Set(tousCreneaux.map(JSON.stringify))).map(JSON.parse);

    res.json(uniqueCreneaux);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

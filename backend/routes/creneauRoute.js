const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const SousService = require('../models/SousService');
const Mecanicien = require('../models/Mecanicien');
const RendezVous = require('../models/RDV');

router.get('/:sousServiceId', async (req, res) => {
  try {
    const { sousServiceId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'La date est requise' });
    }

    // 1️⃣ Récupérer le sous-service et son service parent
    const sousService = await SousService.findById(sousServiceId).populate('serviceId');
    if (!sousService) {
      return res.status(404).json({ error: 'Sous-service introuvable' });
    }

    const service = sousService.serviceId;
    if (!service) {
      return res.status(404).json({ error: 'Service parent introuvable pour ce sous-service' });
    }

    // 2️⃣ Vérifier fermeture (dimanche)
    const dayOfWeek = new Date(date).getDay(); // 0 = dimanche
    if (dayOfWeek === 0) {
      return res.json([]); // fermé
    }

    // 3️⃣ Récupérer les mécaniciens ayant la spécialité du service parent (ex: "Moteur")
    const mecaniciens = await Mecanicien.find({ specialites: service.nom });
    if (!mecaniciens.length) {
      return res.json([]);
    }

    // 4️⃣ Paramètres horaires
    const ouverture = 8 * 60;  
    const fermeture = 18 * 60; 
    const duree = sousService.dureeEstimee;

    let tousCreneaux = [];

    for (const mec of mecaniciens) {
      // Récupérer les RDV existants pour ce mécanicien ce jour-là
      const rdvs = await RendezVous.find({
        mecaniciens: mec._id,
        date: { $gte: startOfDay, $lte: endOfDay }
      });

      // Générer les créneaux possibles
      for (let debutMin = ouverture; debutMin + duree <= fermeture; debutMin += duree) {
        const finMin = debutMin + duree;

        const debutStr = `${String(Math.floor(debutMin/60)).padStart(2,'0')}:${String(debutMin%60).padStart(2,'0')}`;
        const finStr = `${String(Math.floor(finMin/60)).padStart(2,'0')}:${String(finMin%60).padStart(2,'0')}`;

        // Vérifier si le créneau est libre (aucun RDV qui chevauche)
        const estLibre = !rdvs.some(rv => !(finStr <= rv.heureDebut || debutStr >= rv.heureFin));
        if (estLibre) {
          tousCreneaux.push({ debut: debutStr, fin: finStr });
        } else {
          console.log(`❌ Créneau ${debutStr}-${finStr} occupé`);
        }
      }
    }

    // 6️⃣ Supprimer doublons (si plusieurs mécaniciens libres sur même créneau)
    const uniqueCreneaux = Array.from(new Set(tousCreneaux.map(JSON.stringify))).map(JSON.parse);

    console.log("✅ Créneaux disponibles:", uniqueCreneaux.length);

    res.json(uniqueCreneaux);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
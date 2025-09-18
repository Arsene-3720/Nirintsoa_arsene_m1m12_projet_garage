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

    console.log("📌 Charger créneaux → sousServiceId:", sousServiceId, "date:", date);

    // Vérifications
    if (!date) {
      console.error("❌ Date manquante");
      return res.status(400).json({ error: 'La date est requise' });
    }

    const testDate = new Date(date);
    if (isNaN(testDate)) {
      console.error("❌ Date invalide:", date);
      return res.status(400).json({ error: 'Date invalide' });
    }

    if (!mongoose.Types.ObjectId.isValid(sousServiceId)) {
      console.error("❌ ID sous-service invalide:", sousServiceId);
      return res.status(400).json({ error: 'ID sous-service invalide' });
    }

    // 1️⃣ Récupérer le sous-service
    const sousService = await SousService.findById(sousServiceId);
    if (!sousService) {
      console.error("❌ Sous-service introuvable");
      return res.status(404).json({ error: 'Sous-service introuvable' });
    }

    console.log("🔹 Sous-service OK:", {
      id: sousService._id,
      nom: sousService.nom,
      serviceParent: sousService.service,
      dureeEstimee: sousService.dureeEstimee
    });

    // 2️⃣ Vérifier fermeture (dimanche)
    const dayOfWeek = testDate.getDay();
    if (dayOfWeek === 0) {
      console.log("⛔ Fermé le dimanche");
      return res.json([]);
    }

    // 3️⃣ Récupérer les mécaniciens avec la spécialité du SERVICE PARENT
    console.log("🔍 Recherche mécaniciens avec serviceId:", sousService.service);
    
    const mecaniciens = await Mecanicien.find({ 
      'specialites.serviceId': sousService.service 
    });

    console.log("🔹 Mécaniciens trouvés:", mecaniciens.length);
    
    mecaniciens.forEach(m => {
      console.log("👨‍🔧 Mécanicien:", m._id, m.nom, "Spécialités:", m.specialites.length);
    });

    if (!mecaniciens.length) {
      console.log("⚠️ Aucun mécanicien disponible pour ce service");
      return res.json([]);
    }

    // 4️⃣ Paramètres horaires
    const ouverture = 8 * 60;   // 08:00 en minutes
    const fermeture = 18 * 60;  // 18:00 en minutes
    const duree = sousService.dureeEstimee; // 90 minutes

    console.log("🔹 Paramètres:", { ouverture, fermeture, duree });

    let tousCreneaux = [];

    // 5️⃣ Générer les créneaux pour chaque mécanicien
    for (const mec of mecaniciens) {
      console.log("📅 Vérification RDV pour mécanicien:", mec._id);

      const startOfDay = new Date(testDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(testDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Recherche RDV existants
      const rdvs = await RendezVous.find({
        mecaniciens: mec._id,
        date: { $gte: startOfDay, $lte: endOfDay }
      });

      console.log("🔹 RDV existants:", rdvs.length);

      // Générer créneaux possibles
      for (let debutMin = ouverture; debutMin + duree <= fermeture; debutMin += duree) {
        const finMin = debutMin + duree;

        const debutStr = `${String(Math.floor(debutMin / 60)).padStart(2, '0')}:${String(debutMin % 60).padStart(2, '0')}`;
        const finStr = `${String(Math.floor(finMin / 60)).padStart(2, '0')}:${String(finMin % 60).padStart(2, '0')}`;

        // Vérifier si le créneau est libre
        const estLibre = !rdvs.some(rv => !(finStr <= rv.heureDebut || debutStr >= rv.heureFin));

        if (estLibre) {
          tousCreneaux.push({ debut: debutStr, fin: finStr });
        } else {
          console.log(`❌ Créneau ${debutStr}-${finStr} occupé`);
        }
      }
    }

    // 6️⃣ Supprimer doublons
    const uniqueCreneaux = Array.from(new Set(tousCreneaux.map(JSON.stringify))).map(JSON.parse);

    console.log("✅ Créneaux disponibles:", uniqueCreneaux.length);

    res.json(uniqueCreneaux);

  } catch (err) {
    console.error("❌ ERREUR SERVEUR COMPLÈTE:", err.message);
    console.error("❌ STACK TRACE:", err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// routes/rendezvous.routes.js
const express = require('express');
const router = express.Router();
const RendezVous = require('../models/RDV');

router.post('/', async (req, res) => {
  try {
    const newRDV = new RendezVous(req.body);
    await newRDV.save();
    res.status(201).json(newRDV);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET tous les rendez-vous
router.get('/', async (req, res) => {
  try {
    const rdv = await RendezVous.find()
      .populate('client', 'nom email')
      .populate('sousService', 'nom')
      .populate('mecaniciens', 'nom, specialites');
    res.json(rdv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT changer statut
router.put('/:id/statut', async (req, res) => {
  try {
    const { statut } = req.body;
    const rdv = await RendezVous.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    );
    res.json(rdv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;


router.put("/:id/assigner-mecanicien", async (req, res) => {
  try {
    const rdv = await RendezVous.findByIdAndUpdate(
      req.params.id,
      { mecanicien: req.body.mecanicienId },
      { new: true }
    ).populate("mecanicien");
    res.json(rdv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

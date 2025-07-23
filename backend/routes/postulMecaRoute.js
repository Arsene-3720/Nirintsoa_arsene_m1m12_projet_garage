const express = require('express');
const router = express.Router();
const PostulationMecanicien = require('../models/PostulMecanicien');

// POST /postulationmecaniciens → Ajouter une postulation
router.post('/', async (req, res) => {
  try {
    const postulation = new PostulationMecanicien(req.body);
    await postulation.save();
    res.status(201).json(postulation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /postulationmecaniciens → Voir toutes les postulations (manager)
router.get('/', async (req, res) => {
  try {
    const postulations = await PostulationMecanicien.find();
    res.json(postulations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /postulationmecaniciens/:id → Changer le statut (par le manager)
router.put('/:id', async (req, res) => {
  try {
    const updated = await PostulationMecanicien.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /postulationmecaniciens/check?email=xxx → Vérifier statut d’un email
router.get('/check', async (req, res) => {
  const { email } = req.query;
  try {
    const postulation = await PostulationMecanicien.findOne({ email });
    if (!postulation) {
      return res.json({ found: false });
    }

    res.json({
      found: true,
      statut: postulation.statut,
      data: postulation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

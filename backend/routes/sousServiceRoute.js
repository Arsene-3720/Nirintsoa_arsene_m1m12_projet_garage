const express = require('express');
const router = express.Router();
const SousService = require('../models/SousService');
const { verifyToken, onlyManagerGlobal } = require('../middlewares/auth');

// 👉 Ajouter un sous-service
router.post('/', verifyToken, onlyManagerGlobal, async (req, res) => {
  try {
    const newSousService = new SousService(req.body);
    await newSousService.save();
    res.status(201).json(newSousService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 👉 Modifier un sous-service
router.put('/:id', verifyToken, onlyManagerGlobal, async (req, res) => {
  try {
    const updated = await SousService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 👉 Supprimer un sous-service
router.delete('/:id', verifyToken, onlyManagerGlobal, async (req, res) => {
  try {
    await SousService.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sous-service supprimé' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 👉 Obtenir un sous-service par ID
router.get('/:id', async (req, res) => {
  try {
    const sousService = await SousService.findById(req.params.id).populate('service', 'nom');
    if (!sousService) {
      return res.status(404).json({ error: 'Sous-service non trouvé' });
    }
    res.json(sousService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// 👉 Obtenir tous les sous-services
router.get('/', async (req, res) => {
  try {
    const sousServices = await SousService.find().populate('service', 'nom');
    res.json(sousServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /api/creneaux/:sousServiceId?date=YYYY-MM-DD






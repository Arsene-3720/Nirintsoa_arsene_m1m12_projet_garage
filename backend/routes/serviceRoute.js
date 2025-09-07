const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

const { verifyToken, onlyManagerGlobal } = require('../middlewares/auth');


// 👉 Créer un service
router.post('/ajout-service', verifyToken, onlyManagerGlobal, async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 👉 Lire tous les services (accessible à tous)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Modifier un service
router.put('/modif-service/:id', verifyToken, onlyManagerGlobal, async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 👉 Supprimer un service
router.delete('/del-service/:id', verifyToken, onlyManagerGlobal, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service supprimé' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

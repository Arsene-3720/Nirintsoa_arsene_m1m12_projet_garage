const express = require('express');
const router = express.Router();
const Vehicule = require('../models/Vehicule');

router.post('/', async (req, res) => {
  try {
    const newVehicule = new Vehicule(req.body);
    await newVehicule.save();
    res.status(201).json(newVehicule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const vehicules = await Vehicule.find();
    res.json(vehicules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
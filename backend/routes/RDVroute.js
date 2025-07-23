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

router.get('/', async (req, res) => {
  try {
    const rdvs = await RendezVous.find();
    res.json(rdvs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const SousService = require('../models/SousService');

router.post('/', async (req, res) => {
  try {
    const newSousService = new SousService(req.body);
    await newSousService.save();
    res.status(201).json(newSousService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const sousServices = await SousService.find();
    res.json(sousServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
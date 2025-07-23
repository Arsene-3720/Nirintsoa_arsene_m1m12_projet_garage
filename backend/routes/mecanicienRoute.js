const express = require('express');
const router = express.Router();
const Mecanicien = require('../models/Mecanicien');

// POST /mecaniciens → Création de compte une fois accepté
router.post('/', async (req, res) => {
  try {
    const newMecanicien = new Mecanicien(req.body);
    await newMecanicien.save();
    res.status(201).json(newMecanicien);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /mecaniciens/login → Connexion du mécanicien
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const mecanicien = await Mecanicien.findOne({ email });
    if (!mecanicien || mecanicien.password !== password) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    res.json({ message: 'Connexion réussie', mecanicien });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

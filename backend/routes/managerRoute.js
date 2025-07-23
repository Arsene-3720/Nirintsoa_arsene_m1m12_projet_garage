// routes/manager.routes.js
const express = require('express');
const router = express.Router();
const Manager = require('../models/Manager');
const bcrypt = require('bcryptjs');

// 🔒 Création d’un manager
router.post('/register', async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, type } = req.body;
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const manager = new Manager({ nom, prenom, email, motDePasse: hashedPassword, type });
    await manager.save();
    res.status(201).json(manager);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔐 Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const manager = await Manager.findOne({ email });
    if (!manager) return res.status(404).json({ error: 'Manager non trouvé' });

    const isMatch = await bcrypt.compare(motDePasse, manager.motDePasse);
    if (!isMatch) return res.status(401).json({ error: 'Mot de passe incorrect' });

    res.status(200).json(manager); // Tu peux y ajouter un token plus tard
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👀 Voir tous les managers (admin uniquement normalement)
router.get('/', async (req, res) => {
  try {
    const managers = await Manager.find();
    res.json(managers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// auth.routes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Client = require('../models/Client');
const Mecanicien = require('../models/Mecanicien');
const Manager = require('../models/Manager');

router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    // 1. Rechercher dans les 3 collections
    const client = await Client.findOne({ email });
    const mecanicien = await Mecanicien.findOne({ email });
    const manager = await Manager.findOne({ email });

    let user = null;
    let role = null;

    if (client) {
      user = client;
      role = 'client';
    } else if (mecanicien) {
      user = mecanicien;
      role = 'mecanicien';
    } else if (manager) {
      user = manager;
      role = manager.role; // manager-global ou manager-client
    } else {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }

    // 2. Vérifier le mot de passe
    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // 3. Générer le token
    const token = jwt.sign(
      {
        id: user._id,
        role: role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;

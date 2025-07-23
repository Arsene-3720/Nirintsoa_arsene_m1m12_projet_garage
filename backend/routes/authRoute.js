const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const Client = require('../models/Client');
const Mecanicien = require('../models/Mecanicien');
const Manager = require('../models/Manager');

// Utilitaire pour générer un token
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET, // ✅ depuis .env, // 🔐 à remplacer par variable d'environnement
    { expiresIn: '1d' }
  );
}

// Route de connexion générique (email + motDePasse + rôle à envoyer depuis le front)
router.post('/login', async (req, res) => {
  const { email, motDePasse, role } = req.body;

  let Model;
  if (role === 'client') Model = Client;
  else if (role === 'mecanicien') Model = Mecanicien;
  else if (role === 'manager-global' || role === 'manager-client') Model = Manager;
  else return res.status(400).json({ error: 'Rôle invalide' });

  const user = await Model.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const valid = await bcrypt.compare(motDePasse, user.motDePasse);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

  const token = generateToken(user);
  res.json({ token, userId: user._id, role: user.role });
});

module.exports = router;

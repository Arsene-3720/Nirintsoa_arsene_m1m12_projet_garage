// routes/manager.routes.js
const express = require('express');
const router = express.Router();
const Manager = require('../models/Manager');
const Utilisateur = require('../models/utilisateur');
const bcrypt = require('bcryptjs');

// 🔒 Création d’un manager
router.post('/register-manager', async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, telephone, type } = req.body;

    const nouveauManager = new Manager({ nom, prenom, email, motDePasse, telephone, type });
    await nouveauManager.save();
    console.log('Manager créé:', nouveauManager);

    try {
      const utilisateur = await Utilisateur.create({
        email,
        motDePasse,
        role: type === 'global' ? 'manager-global' : 'manager-client',
        refId: nouveauManager._id,
        roleModel: 'Manager'
      });
      console.log('Utilisateur créé:', utilisateur);
    } catch (e) {
      console.error('Erreur création utilisateur:', e);
      return res.status(500).json({ message: 'Erreur création utilisateur', error: e.message });
    }

    res.status(201).json({ message: 'Manager et utilisateur inscrits avec succès' });
  } catch (err) {
    console.error('Erreur inscription manager:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});



// middleware d'authentification à faire si besoin (onlyManagerClient)
router.put('/valider-postulation/:email', async (req, res) => {
  try {
    const postulation = await PostulationMecanicien.findOne({ email: req.params.email });
    if (!postulation) return res.status(404).json({ message: 'Postulation non trouvée' });

    postulation.statut = 'accepte';
    await postulation.save();

    res.json({ message: 'Postulation acceptée. Le mécanicien peut maintenant créer son compte.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});


// 🔐 Connexion
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tonSecretJWTUltraSecure'; // mets-le dans .env plus tard

router.post('/login-manager', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!isMatch) return res.status(401).json({ error: 'Mot de passe incorrect' });

    // Récupérer les infos spécifiques selon le rôle
    let roleInfos = null;
    if (utilisateur.roleModel === 'Manager') {
      const manager = await Manager.findById(utilisateur.refId);
      if (!manager) return res.status(404).json({ error: 'Manager non trouvé' });

      roleInfos = {
        id: utilisateur._id,
        email: utilisateur.email,
        role: utilisateur.role,
        typeManager: manager.type, // 'global' ou 'client-mecanicien'
        nom: manager.nom,
        prenom: manager.prenom
      };
    }

    // Générer un token JWT
    const token = jwt.sign({ id: utilisateur._id, role: utilisateur.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({
      token,
      utilisateur: roleInfos
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 👀 Voir tous les managers (admin uniquement normalement)
router.get('/list-manager', async (req, res) => {
  try {
    const managers = await Manager.find();
    res.json(managers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

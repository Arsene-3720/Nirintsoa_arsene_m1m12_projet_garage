const express = require('express');
const router = express.Router();
const Mecanicien = require('../models/Mecanicien');

router.post('/postuler-mecanicien', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, specialites } = req.body;

    const exist = await PostulationMecanicien.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email déjà utilisé' });

    const postulation = await PostulationMecanicien.create({ nom, prenom, email, telephone, specialites });

    res.status(201).json({ message: 'Postulation envoyée. En attente de validation.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});


// POST /mecaniciens → Création de compte une fois accepté
router.post('/register-mecanicien', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const postulation = await PostulationMecanicien.findOne({ email });
    if (!postulation || postulation.statut !== 'accepte')
      return res.status(403).json({ message: 'Postulation non acceptée' });

    const exist = await Utilisateur.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Compte déjà créé' });

    const nouveauMecanicien = await Mecanicien.create({
      nom: postulation.nom,
      prenom: postulation.prenom,
      email: postulation.email,
      telephone: postulation.telephone,
      specialites: postulation.specialites,
      motDePasse
    });

    await Utilisateur.create({
      email,
      motDePasse,
      role: 'mecanicien',
      refId: nouveauMecanicien._id,
      roleModel: 'Mecanicien'
    });

    // Optionnel : supprimer la postulation
    await PostulationMecanicien.deleteOne({ _id: postulation._id });

    res.status(201).json({ message: 'Inscription du mécanicien réussie' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
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


router.get('/statut-postulation/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const postulation = await PostulationMecanicien.findOne({ email });

    if (!postulation) return res.status(404).json({ message: 'Postulation non trouvée' });

    res.json({ statut: postulation.statut });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});
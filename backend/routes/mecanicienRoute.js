const express = require('express');
const router = express.Router();
const Mecanicien = require('../models/Mecanicien');
const PostulationMecanicien = require('../models/PostulMecanicien');
const Utilisateur = require('../models/utilisateur');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// POST /mecaniciens → Création de compte une fois accepté


// Stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/profil_mecaniciens');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ex : cv-<timestamp>-nomoriginal.pdf
    cb(null, 'images-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/register-mecanicien', upload.single('images'), async (req, res) => {
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
      motDePasse,
      photo: req.file ? `/uploads/profil_mecaniciens/${req.file.filename}` : undefined
    });

    await Utilisateur.create({
      email,
      motDePasse,
      role: 'mecanicien',
      refId: nouveauMecanicien._id,
      roleModel: 'Mecanicien'
    });

    await PostulationMecanicien.deleteOne({ _id: postulation._id });

    res.status(201).json({ message: 'Inscription du mécanicien réussie' });
  } catch (err) {
    console.error('Erreur serveur :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});




// POST /mecaniciens/login → Connexion du mécanicien
// router.post('/login-mecanicien', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const mecanicien = await Mecanicien.findOne({ email });
//     if (!mecanicien || mecanicien.motDePasse !== password) {
//       return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
//     }
//     res.json({ message: 'Connexion réussie', mecanicien });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// POST /mecaniciens/login → Connexion du mécanicien


router.post('/login-mecanicien', async (req, res) => {
  const { email, password } = req.body;
  try {
    const mecanicien = await Mecanicien.findOne({ email });

    // Si mécanicien accepté
    if (mecanicien) {
      
      if (!mecanicien || mecanicien.motDePasse !== password) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
      console.log(`Connexion réussie pour ${email}`);
      return res.json({ status: 'accepted', message: 'Connexion réussie', mecanicien });
    }

    // Vérifier si en attente ou rejet
    const postulation = await PostulationMecanicien.findOne({ email });
    if (postulation) {
      if (postulation.statut === 'en attente') {
        return res.json({ status: 'pending', message: 'Votre candidature est encore en attente.' });
      }
      if (postulation.statut === 'rejetee') {
        return res.json({ status: 'rejected', message: 'Votre candidature a été rejetée.' });
      }
    }

    // Pas encore inscrit
    return res.json({ status: 'not-found', message: 'Aucun compte trouvé, veuillez vous inscrire.' });

  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Erreur serveur', error: err.message });
  }
});




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

module.exports = router;
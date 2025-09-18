const express = require('express');
const router = express.Router();
const Mecanicien = require('../models/Mecanicien');
const PostulationMecanicien = require('../models/PostulMecanicien');
const Utilisateur = require('../models/utilisateur');
const SousService = require('../models/SousService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


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

    console.log('--- Debug register-mecanicien ---');
    console.log('Email reçu :', email);

    // Vérifier la postulation
    const postulation = await PostulationMecanicien.findOne({ email });
    console.log('Postulation trouvée :', postulation);

    if (!postulation || postulation.statut !== 'accepte') {
      console.log('Postulation non acceptée ou inexistante');
      return res.status(403).json({ message: 'Postulation non acceptée' });
    }

    const exist = await Utilisateur.findOne({ email });
    console.log('Utilisateur existant :', exist);
    if (exist) return res.status(400).json({ message: 'Compte déjà créé' });

    // 🔹 Parser les spécialités si c’est un JSON string
    let specialites = postulation.specialites;
    if (typeof specialites === 'string') {
      try {
        specialites = JSON.parse(specialites);
      } catch (err) {
        console.error('Erreur parsing JSON des spécialités :', err);
        return res.status(400).json({ message: 'Format spécialités invalide' });
      }
    }

    console.log('Specialites à traiter :', specialites);

    // Récupérer tous les sous-services avec leur service parent
    const sousServices = await SousService.find().populate('service');
    console.log('Sous-services récupérés :', sousServices.map(ss => ({ nom: ss.nom, service: ss.service.nom })));

    // 🔹 Corrigé : comparer avec le service parent pour matcher les spécialités
    const nouvellesSpecialites = specialites.map(nomSpecialite => {
      // trouver le premier sous-service qui a ce service
      const ss = sousServices.find(s => s.service.nom === nomSpecialite);
      if (!ss) {
        console.log('Spécialité non trouvée dans SousService :', nomSpecialite);
        return null;
      }
      return { serviceId: ss.service._id, nomService: ss.service.nom };
    }).filter(s => s !== null);

    console.log('Nouvelles spécialités à enregistrer :', nouvellesSpecialites);

    if (nouvellesSpecialites.length === 0) {
      return res.status(400).json({ message: 'Aucune spécialité valide sélectionnée.' });
    }

    // Créer le mécanicien
    const nouveauMecanicien = await Mecanicien.create({
      nom: postulation.nom,
      prenom: postulation.prenom,
      email: postulation.email,
      telephone: postulation.telephone,
      specialites: nouvellesSpecialites,
      motDePasse,
      photo: req.file ? `/uploads/profil_mecaniciens/${req.file.filename}` : undefined
    });

    console.log('Mécanicien créé :', nouveauMecanicien);

    // Créer l'utilisateur pour authentification
    await Utilisateur.create({
      email,
      motDePasse,
      role: 'mecanicien',
      refId: nouveauMecanicien._id,
      roleModel: 'Mecanicien'
    });

    // Supprimer la postulation
    await PostulationMecanicien.deleteOne({ _id: postulation._id });

    res.status(201).json({ message: 'Inscription du mécanicien réussie', mecanicien: nouveauMecanicien });

  } catch (err) {
    console.error('Erreur serveur :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});



module.exports = router;


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


// GET /mecaniciens → récupérer la liste de tous les mécaniciens
router.get('/liste-mecaniciens', async (req, res) => {
  try {
    const mecaniciens = await Mecanicien.find().select('-motDePasse'); // on cache le mot de passe
    res.json(mecaniciens);
  } catch (err) {
    console.error('Erreur serveur :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

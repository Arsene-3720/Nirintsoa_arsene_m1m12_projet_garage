const express = require('express');
const router = express.Router();
const PostulationMecanicien = require('../models/PostulMecanicien');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurer multer pour upload CV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/cv');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ex : cv-<timestamp>-nomoriginal.pdf
    cb(null, 'cv-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /postulationmecaniciens → Ajouter une postulation avec upload CV
router.post('/postuler-mecanicien', upload.single('cv'), async (req, res) => {
  try {
    const data = req.body;

    // Ajouter chemin du CV si présent
    if (req.file) {
      data.cv = `/uploads/cv/${req.file.filename}`;
    }

    // Vérifier unicité email
    const exist = await PostulationMecanicien.findOne({ email: data.email });
    if (exist) {
      return res.status(400).json({ error: 'Une postulation avec cet email existe déjà.' });
    }

    // Créer la postulation
    const postulation = new PostulationMecanicien(data);
    await postulation.save();

    res.status(201).json({ message: 'Postulation enregistrée.', postulation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

// GET /postulationmecaniciens → Voir toutes les postulations (manager)
router.get('/liste-postulation', async (req, res) => {
  try {
    const postulations = await PostulationMecanicien.find();
    res.json(postulations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /postulationmecaniciens/:id → Changer le statut (par le manager)
router.put('/statut-manager/:id', async (req, res) => {
  try {
    const updated = await PostulationMecanicien.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /postulationmecaniciens/check?email=xxx → Vérifier statut d’un email
router.get('/statut-postulation', async (req, res) => {
  const { email } = req.query;
  try {
    if (!email) return res.status(400).json({ error: 'Email manquant' });

    const postulation = await PostulationMecanicien.findOne({ email });
    if (!postulation) {
      return res.json({ found: false });
    }

    res.json({
      found: true,
      statut: postulation.statut,
      data: postulation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

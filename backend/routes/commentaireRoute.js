const express = require('express');
const router = express.Router();
const Commentaire = require('../models/Commentaire');

router.post('/', async (req, res) => {
  try {
    const newCommentaire = new Commentaire(req.body);
    await newCommentaire.save();
    res.status(201).json(newCommentaire);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const commentaires = await Commentaire.find();
    res.json(commentaires);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

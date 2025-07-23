const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// POST /clients : enregistrement
router.post('/', async (req, res) => {
  try {
    const newClient = new Client(req.body);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// GET /clients/:id : récupérer un client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('informations');
    if (!client) return res.status(404).json({ error: 'Client non trouvé' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /clients/:id : mettre à jour
router.put('/:id', async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /clients/:id : supprimer
router.delete('/:id', async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

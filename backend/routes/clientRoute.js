const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// POST /clients : enregistrement
router.post('/register-client', async (req, res) => {
  try {
    const { nom, prenom, email, dateNaissance, telephone, motDePasse } = req.body;

    const nouveauClient = await Client.create({ nom, prenom, email, dateNaissance, telephone, motDePasse });

    await Utilisateur.create({
      email,
      motDePasse,
      role: 'client',
      refId: nouveauClient._id,
      roleModel: 'Client'
    });

    res.status(201).json({ message: 'Client inscrit avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
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

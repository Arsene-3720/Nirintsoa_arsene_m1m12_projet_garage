const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Utilisateur = require('../models/utilisateur');
const InformationClient = require('../models/InfoClient');
const Vehicule = require('../models/Vehicule');
const bcrypt = require('bcryptjs');

// POST /clients : enregistrement
router.post('/register-client', async (req, res) => {
  try {
    console.log('=== DÉBUT DEBUG INSCRIPTION COMPLÈTE ===');
    console.log('Body reçu:', JSON.stringify(req.body, null, 2));

    const {
      nom, prenom, email, dateNaissance, telephone, motDePasse,
      adresse, codePostal, ville, autresInfos, vehicule
    } = req.body;

    // ⚠️ LOGS CRITIQUES - À SURVEILLER
    console.log('=== ANALYSE MOT DE PASSE REÇU ===');
    console.log('Mot de passe reçu (brut):', `"${motDePasse}"`);
    console.log('Type:', typeof motDePasse);
    console.log('Length:', motDePasse?.length);
    console.log('Is string:', typeof motDePasse === 'string');
    console.log('Bytes du mot de passe:', Array.from(motDePasse || '').map(c => `${c}(${c.charCodeAt(0)})`));

    // Vérifier si l'email existe déjà
    const existingUser = await Utilisateur.findOne({ email });
    if (existingUser) {
      console.log('Email déjà utilisé:', email);
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // ⚠️ POINT CRITIQUE - HASHAGE
    console.log('=== PROCESSUS DE HASHAGE ===');
    console.log('Avant hashage - mot de passe:', `"${motDePasse}"`);
    
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    
    console.log('Après hashage - hash créé:', hashedPassword);
    console.log('Length du hash:', hashedPassword.length);

    // ⚠️ TEST IMMÉDIAT CRITIQUE
    console.log('=== TEST IMMÉDIAT APRÈS HASHAGE ===');
    const testImmediat1 = await bcrypt.compare(motDePasse, hashedPassword);
    console.log('Test avec mot de passe original:', testImmediat1 ? '✅' : '❌');

    // Tests avec variations
    const testTrim = await bcrypt.compare(motDePasse.trim(), hashedPassword);
    console.log('Test avec trim:', testTrim ? '✅' : '❌');

    if (!testImmediat1) {
      console.log('🚨 PROBLÈME DÉTECTÉ - Le hash ne correspond pas au mot de passe !');
      console.log('Ceci explique pourquoi la connexion ne marche pas !');
      
      // Investigations supplémentaires
      const testString = await bcrypt.compare(String(motDePasse), hashedPassword);
      console.log('Test avec String():', testString ? '✅' : '❌');
      
      return res.status(500).json({ 
        message: 'Erreur de hashage détectée', 
        debug: 'Le mot de passe ne correspond pas au hash créé' 
      });
    }

    // Étapes de création (seulement si le test passe)
    const info = await InformationClient.create({
      adresse, codePostal, ville, autresInfos
    });
    console.log('InformationClient créé:', info._id);

    const nouveauClient = await Client.create({
      nom, prenom, email, dateNaissance, telephone,
      informations: info._id
    });
    console.log('Client créé:', nouveauClient._id);

    // ⚠️ CRÉATION UTILISATEUR - MOMENT CRITIQUE
    console.log('=== CRÉATION UTILISATEUR ===');
    console.log('Hash qui va être stocké:', hashedPassword);
    
    const utilisateur = await Utilisateur.create({
      email,
      motDePasse: hashedPassword,
      role: 'client',
      refId: nouveauClient._id,
      roleModel: 'Client'
    });
    
    console.log('Utilisateur créé avec ID:', utilisateur._id);

    // ⚠️ VÉRIFICATION POST-CRÉATION
    console.log('=== VÉRIFICATION POST-CRÉATION ===');
    const utilisateurVerif = await Utilisateur.findOne({ email });
    console.log('Hash récupéré de la BDD:', utilisateurVerif.motDePasse);
    console.log('Hash identique?', hashedPassword === utilisateurVerif.motDePasse);

    const testPostCreation = await bcrypt.compare(motDePasse, utilisateurVerif.motDePasse);
    console.log('Test après création:', testPostCreation ? '✅ OK' : '❌ ÉCHEC');

    if (!testPostCreation) {
      console.log('🚨 PROBLÈME POST-CRÉATION - Le mot de passe ne marche plus après sauvegarde !');
    }

    // Créer véhicule si fourni
    if (vehicule && vehicule.marque) {
      const veh = await Vehicule.create({
        client: nouveauClient._id,
        marque: vehicule.marque,
        modele: vehicule.modele,
        immatriculation: vehicule.immatriculation,
        annee: vehicule.annee
      });
      console.log('Véhicule créé:', veh._id);
    }

    console.log('=== INSCRIPTION TERMINÉE ===');
    res.status(201).json({ 
      message: 'Client inscrit avec succès',
      debug: {
        hashTest: testPostCreation,
        userId: utilisateur._id
      }
    });

  } catch (err) {
    console.error('Erreur complète inscription:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});



router.post('/login-client', async (req, res) => {
  const { email, motDePasse } = req.body;

  // Vérification initiale
  if (!email || !motDePasse) {
    return res.status(400).json({ status: 'error', message: 'Email et mot de passe requis.' });
  }

  console.log('=== DÉBUT DEBUG LOGIN ===');
  console.log('Email reçu:', email);
  console.log('Mot de passe reçu (brut):', `"${motDePasse}"`);
  console.log('Length mot de passe:', motDePasse.length);
  console.log('Mot de passe trimé:', `"${motDePasse.trim()}"`);
  console.log('Length après trim:', motDePasse.trim().length);

  try {
    // Chercher l'utilisateur client
    const utilisateur = await Utilisateur.findOne({ email, role: 'client' });
    if (!utilisateur) {
      console.log('Utilisateur non trouvé');
      return res.status(404).json({ status: 'not-found', message: 'Aucun compte trouvé.' });
    }

    console.log('Hash stocké en BDD:', utilisateur.motDePasse);
    console.log('Length du hash:', utilisateur.motDePasse.length);

    // Test 1: Comparaison normale
    const valid = await bcrypt.compare(motDePasse.trim(), utilisateur.motDePasse);
    console.log('Résultat comparaison bcrypt (trim):', valid);

    // Test 2: Comparaison sans trim
    const validNoTrim = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    console.log('Résultat comparaison bcrypt (no trim):', validNoTrim);

    // Test 3: Créer un nouveau hash avec le même mot de passe pour tester
    const nouveauHash = await bcrypt.hash(motDePasse.trim(), 10);
    console.log('Nouveau hash créé:', nouveauHash);
    const testAvecNouveauHash = await bcrypt.compare(motDePasse.trim(), nouveauHash);
    console.log('Test avec nouveau hash:', testAvecNouveauHash);

    // Test 4: Vérifier si le hash stocké est valide
    const isValidHash = /^\$2[abxy]?\$\d+\$/.test(utilisateur.motDePasse);
    console.log('Hash stocké est-il valide?', isValidHash);

    if (!valid && !validNoTrim) {
      console.log('=== ÉCHEC DE L\'AUTHENTIFICATION ===');
      return res.status(401).json({ status: 'error', message: 'Mot de passe incorrect.' });
    }

    // Récupérer infos client
    const client = await Client.findById(utilisateur.refId).populate('informations');
    if (!client) {
      return res.status(404).json({ status: 'not-found', message: 'Client introuvable.' });
    }

    // Supprimer mot de passe avant envoi
    const { motDePasse: _, ...clientData } = utilisateur.toObject();

    console.log('=== CONNEXION RÉUSSIE ===');
    res.json({ status: 'ok', message: 'Connexion réussie', client: clientData });

  } catch (err) {
    console.error('Erreur login-client:', err);
    res.status(500).json({ status: 'error', message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;





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

// Exemple backend : routes/clients.routes.js
router.get('/:clientId/vehicules', async (req, res) => {
  try {
    const { clientId } = req.params;
    const vehicules = await Vehicule.find({ client: clientId });
    res.json(vehicules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

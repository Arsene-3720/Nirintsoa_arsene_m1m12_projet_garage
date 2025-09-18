// test-direct.js - Testez directement vos modèles
const mongoose = require('mongoose');

async function testDirect() {
  try {
    console.log("🔥 Connexion MongoDB...");
    await mongoose.connect('mongodb+srv://razafindralambo3720_db_user:Nirintsoa_arsene%2F3720@cluster0.bxhancn.mongodb.net/garage_db');
    console.log("✅ Connecté");

    console.log("🔥 Import SousService...");
    const SousService = require('./models/SousService');
    console.log("✅ SousService importé");

    console.log("🔥 Test findById...");
    const sousService = await SousService.findById('68bc99e3a45b9b2976fe474f');
    console.log("✅ Résultat:", sousService);

    console.log("🔥 Import Mecanicien...");
    const Mecanicien = require('./models/Mecanicien');
    console.log("✅ Mecanicien importé");

    console.log("🔥 Test find Mecaniciens...");
    const mecaniciens = await Mecanicien.find({});
    console.log("✅ Mécaniciens:", mecaniciens.length);

    mecaniciens.forEach(m => {
      console.log("👨‍🔧", m._id, m.nom, "Spécialités:", m.specialites);
    });

  } catch (error) {
    console.error("❌ ERREUR:", error.message);
    console.error("❌ STACK:", error.stack);
  } finally {
    process.exit(0);
  }
}

testDirect();
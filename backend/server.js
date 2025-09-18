// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/clients', require('./routes/clientRoute'));


app.use('/api/rendezvous', require('./routes/RDVroute'));

app.use('/api/Vehicules', require('./routes/vehiculeRoute'));
app.use('/api/Managers', require('./routes/managerRoute'));

app.use('/api/Mecaniciens', require('./routes/mecanicienRoute'));
app.use('/uploads/mecaniciens', express.static(path.join(__dirname, 'uploads/mecaniciens')));


app.use('/api/PostulMeca', require('./routes/postulMecaRoute'));
app.use('/uploads/cv', express.static(path.join(__dirname, 'uploads/cv')));

app.use('/api/services', require('./routes/serviceRoute'));
app.use('/api/SousServices', require('./routes/sousServiceRoute'));

app.use('/api/creneaux', require('./routes/creneauRoute'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours sur http://localhost:${PORT}`);
});



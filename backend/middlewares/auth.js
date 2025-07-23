const jwt = require('jsonwebtoken');

// Vérifie que le token JWT est valide
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token requis' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
}

// Vérifie si le rôle est "client"
function onlyClient(req, res, next) {
  if (req.user.role !== 'client')
    return res.status(403).json({ error: 'Accès refusé (client requis)' });
  next();
}

// Vérifie si le rôle est "mécanicien"
function onlyMecanicien(req, res, next) {
  if (req.user.role !== 'mecanicien')
    return res.status(403).json({ error: 'Accès refusé (mécanicien requis)' });
  next();
}

// Vérifie si le rôle est "manager-client" ou "manager-global"
function onlyManager(req, res, next) {
  if (req.user.role !== 'manager-client' && req.user.role !== 'manager-global')
    return res.status(403).json({ error: 'Accès refusé (manager requis)' });
  next();
}

// Vérifie si le rôle est uniquement "manager-global"
function onlyManagerGlobal(req, res, next) {
  if (req.user.role !== 'manager-global')
    return res.status(403).json({ error: 'Accès refusé (manager global requis)' });
  next();
}

module.exports = {
  verifyToken,
  onlyClient,
  onlyMecanicien,
  onlyManager,
  onlyManagerGlobal,
};

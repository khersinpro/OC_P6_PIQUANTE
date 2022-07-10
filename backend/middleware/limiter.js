const rateLimit = require('express-rate-limit');

// Permet de gerer les attaques par force brute
exports.connexionLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Trop de tentatives de connexion entrante avec cette adresse IP, veuillez ressayer plus tard.'
});
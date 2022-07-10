const express = require('express');
const router = express.Router();
const {createUser, login} = require('../controllers/userController');
const {connexionLimiter} = require('../middleware/limiter');

router.post("/signup", createUser);
router.post("/login", connexionLimiter, login);

module.exports = router;
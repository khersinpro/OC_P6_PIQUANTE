const express = require("express");
const router =  express.Router();
const {createSauce, getAllSauces, getOneSauce, modifySauce, deleteSauce, like} = require("../controllers/sauceController");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

router.post('/sauces',auth, multer, createSauce);
router.put('/sauces/:id',auth, multer, modifySauce);
router.post('/sauces/:id/like',auth, like);
router.delete('/sauces/:id',auth, multer, deleteSauce);
router.get('/sauces', auth, getAllSauces);
router.get('/sauces/:id', auth, getOneSauce);

module.exports = router;
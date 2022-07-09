const express = require("express");
const router =  express.Router();
const {createSauce, getAllSauces} = require("../controllers/sauceController");
const multer = require('../middleware/multer-config')

router.post('/sauces', multer, createSauce);
router.get('/sauces', getAllSauces)

module.exports = router
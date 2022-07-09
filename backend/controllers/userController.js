const User =  require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//*** Création d'un utilisateur ***/
exports.createUser = (req, res, next) => {
    //hachage du password en 10 passes
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        //création de l'utilisateur avec le hash du password
        const user = new User({email: req.body.email, password: hash})
        //sauvegarde de l'utilisateur dans la base de donnée
        user.save()
        .then(() => res.status(201).json({message: 'User created'}))
        .catch(() => res.status(400).json({message: 'An error occurred, try later'}));
    })
    .catch(error => {
        res.status(500).json({message :'An error occurred, try later', error});
    });
};

//*** Connexion d'un utilisateur ***/
exports.login = (req, res, next) => {
    // Recherche un utilisateur dans la BDD grâce a son email
    User.findOne({email: req.body.email})
    .then(user =>{
        // S'il n'y a pas d'utilisateur, reponse 404
        if(!user){
            return res.status(404).json({message: "E-mail ou mot de passe incorrect"});
        };
        // Comparaison des mots de passe avec bcrypt
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // Si le mot de passe est faut, reponse 400
            if(!valid){
                return res.status(400).json({message: "E-mail ou mot de passe incorrect"});
            };
            // Sinon reponse 200 avec l'userId et le JWT
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    process.env.ACCESS_TOKEN,
                    {expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({message :'An error occurred, try later', error}));
    })
    .catch(error => res.status(500).json({message :'An error occurred, try later', error}));
};
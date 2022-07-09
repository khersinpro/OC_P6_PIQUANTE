const Sauce = require("../models/Sauce")

//*** Création d'une sauce ***/
exports.createSauce = (req, res, next) => {
    const sauce = JSON.parse(req.body.sauce)
    const newSauce = new Sauce({
        ...sauce,
        // http + :// + localhost:3000 + /images/ + nom du fichier
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    newSauce.save()
    .then(
        res.status(201).json({message: 'Successful sauce creation'})
    )
    .catch(error => res.status(500).json({message: 'An error occurred, try later' , error}))
};
//*** Recuperer toutes les sauces ***/
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => {
        res.status(200).json(sauces);
    })
    .catch(error => {
        res.status(500).json({message: "No results found", error});
    });
};
//*** Recuperer la sauce avec l'id dans le req.params ***/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if(!sauce){
            return res.status(404).json("No results found");
        };
        res.status(200).json(sauce);
    })
    .catch(error => {
        res.status(500).json({message: 'An error occurred, try later' , error});
    });
};
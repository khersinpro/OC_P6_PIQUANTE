const Sauce = require("../models/Sauce");
const fs = require('fs');

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
        if(!sauces){
            return res.status(404).json({message: "No results found"});
        };
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
//*** Modification d'une sauce ***/
exports.modifySauce = (req, res, next) => {
    // Fonction de mise a jour d'une sauce
    const updateSauce = (id, params) => {
        Sauce.updateOne(id, params)
        .then(() => {
            res.status(201).json({message: 'Sauce updated'});
        })
        .catch(error => {
            res.status(400).json({message: 'An error occurred, try later' , error});
        });
    };
    // Trouver une sauce par rapport à l'ID
    Sauce.findOne({_id: req.params.id})
    .then(sauce =>{
        if(req.auth.userId !== sauce.userId){
            return res.status(401).json({message: 'Unauthorized request'});
        };
        // Controle pour savoir si la sauce existe
        if(!sauce){
            return res.status(404).json({message: "No results found"});
        };
        // S'il y a un fichier
        if(req.file){
            const image = sauce.imageUrl.split('/images/')[1];
            return fs.unlink(`images/${image}`, () => {
                updateSauce(
                    {_id: req.params.id},
                    {...req.body, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`}
                )
            });
        };
        // Sans fichier
        updateSauce({_id: req.params.id}, {...req.body});
    });
};
//*** Supprimer une sauce ***/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        // S'il n'y a pas de sauce
        if(!sauce){
            return res.status(404).json();
        };
        // Suppression de l'image de la sauce grâce a fs puis supression de la BDD avec deleteOne()
        const image = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${image}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce deleted'}))
            .catch(error => res.status(500).json({message: 'An error occurred, try later' , error}));
        });
    })
    .catch(error => {
        res.status(500).json({message: 'An error occurred, try later' , error});
    });
};
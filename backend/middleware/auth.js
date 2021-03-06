const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        const userId = decodedToken.userId;
        //*** Add userId in req.auth ***//
        req.auth = {userId}; 
        if(req.body.userId && req.body.userId !== userId){
            throw 'Invalid user ID!';
        }else{
            next();
        };
    }catch(error){
        res.status(401).json(error);
    };
};
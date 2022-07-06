const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("ok"))
.catch(err => console.log(err));


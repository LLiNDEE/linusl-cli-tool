const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3400;

async function run(){
    try{

        const app = express();

        app.use(cors());
        app.use(express.urlencoded({ extended: true}));
        app.use(express.json());

        app.listen(PORT);
        
        require('./routes')(app);

    }catch(error){
        console.log(error.message);
    }
}
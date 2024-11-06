const mongoose = require('mongoose');

async function connectToMongo(url){
    return await mongoose.connect(url);
}

module.exports = {
    connectToMongo,
};
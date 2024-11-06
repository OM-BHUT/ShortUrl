const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    shortId:{
        type:String,
        unique:true,
        required:true
    },
    redirectUrl:{
        type:String,
        required:true
    },
    details:[{
        timestamp:{type:Number}
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
    }
},{timestamps:true});

module.exports = mongoose.model('shortUrl',schema);
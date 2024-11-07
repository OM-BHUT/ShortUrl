const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, unique: true },
    profilePicture: { type: String },
    role:{
        type:String,
        default:'normal'
    },
    userType:   {type:String,default:'google'}
});

module.exports = mongoose.model('GoogleUsers', userSchema);

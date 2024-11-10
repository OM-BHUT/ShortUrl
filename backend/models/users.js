const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:'https://shorturl-16sn.onrender.com/api/static/default-profile-account.jpg'
    },
    role:{
      type:String,
        default:'normal'
    },
    userType:{
       type:String,
       default:'otp'
    },
    lastLogin:{
        type:Date,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
},{timestamps:true})


module.exports = mongoose.model('User',schema);
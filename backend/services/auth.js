require('dotenv').config({path: '../.env'});
const jwt = require('jsonwebtoken');

function setUser(user){

    return jwt.sign({
        _id: user._id,
        email: user.email,
        userType: user.userType
    },process.env.SECRETKEY);
}

function getUser(token){
    if(!token) return null;
    try {
    return jwt.verify(token,process.env.SECRETKEY);
    } catch (error) {
        return console.log(error);
    }
}



module.exports = {
    setUser,
    getUser
} 
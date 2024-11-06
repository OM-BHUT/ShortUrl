const User = require('../models/users');
const {getUser} = require("./auth");


async function giveUserFromDb(token){
    if (!token){
        return null;
    }
    const userFromToken = getUser(token);
    if (!userFromToken){
        return null;
    }
    const user = await User.findOne({
        _id:userFromToken._id,
        email: userFromToken.email
    })
    if (!user){
        return null;
    }
    return user;
}


module.exports = {
    giveUserFromDb
}
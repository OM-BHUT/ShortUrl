const User = require('../models/users');
const GoogleUser = require('../models/GoogleUsers');
const {getUser} = require("./auth");


async function giveUserFromDb(token){
    console.log('from giveUserFromDb');
    console.log(token);
    
    if (!token){
        return null;
    }
    const userFromToken = getUser(token);
    console.log(userFromToken);
    
    if (!userFromToken){
        return null;
    }
    const dbToUse = userFromToken.userType==='google' ? GoogleUser : User;
    const user = await dbToUse.findOne({
        _id:userFromToken._id,
        email: userFromToken.email
    })
    console.log(user);
    
    if (!user){
        return null;
    }
    return user;
}


module.exports = {
    giveUserFromDb
}
const {getUser} = require('../services/auth');


async function checkForAuthentication(req,res,next){
    const userUid = req.cookies?.userId;
    req.user = null;
    if (!userUid) {
        return res.status(401).json({error:'no token'});
    }
    const user = await getUser(userUid);
    if(!user) return res.status(404).json({error:'user not found'});
    req.user = user;
    return next();
}

function restrictTo(roles=[]){
    return function(req,res,next){
        if(!req.user) return res.redirect('/login');
        if(!roles.includes(req.user.role)) return res.end('Unauthorized');
        return next();
    }
}

module.exports = {
    checkForAuthentication,
    restrictTo,
}
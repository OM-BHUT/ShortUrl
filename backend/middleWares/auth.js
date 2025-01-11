const {getUser} = require('../services/auth');
const {giveUserFromDb} = require("../services/giveUser");


async function checkForAuthentication(req, res, next) {
    try {
        // Retrieve user from the database based on the userId in cookies

        const user = await giveUserFromDb(req.cookies.userId);

        // If user is not found, respond with a 404 error

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Attach the user object to the request for further use
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle any errors that occur during the database call
        console.error("Authentication error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


function restrictTo(roles=[]){
    return function(req,res,next){
        if(!req.user) return res.status(404).json({error:'no user'});
        if(!roles.includes(req.user._doc.role)) return res.status(401).json({error:'Unauthorized'});
        return next();
    }
}

module.exports = {
    checkForAuthentication,
    restrictTo,
}
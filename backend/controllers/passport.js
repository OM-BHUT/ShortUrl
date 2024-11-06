require('dotenv').config({path:'../.env'});
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const GoogleUsers = require('../models/GoogleUsers');


passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/api/google/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            console.log('entered passport.js');
            let user = await GoogleUsers.findOne({googleId: profile.id});
            if (!user){
                user = await GoogleUsers.create({
                    googleId:profile.id,
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    profilePicture:profile.photos[0].value
                });
            }
            return cb(null,user);
        }catch (error){
            return cb(error,null);
        }
    }
));


passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
})


module.exports=passport;
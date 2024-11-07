require('dotenv').config();
const express = require('express');
const {connectToMongo} = require('./connection');
const shortUrl = require('./models/shortUrl');
const cookieParser = require('cookie-parser');
const router = require('./routes/shortUrlRoutes');
const { bodyParse } = require('./middleWares/index');
const path = require('path');
const {checkForAuthentication,
    restrictTo,
} = require('./middleWares/auth');
const userRouter = require('./routes/user');
const mongoose = require('mongoose');
const port = process.env.PORT || 8080;
const cors = require('cors');
const session = require('express-session');
const passport = require('./controllers/passport');
const googleRoutes = require('./routes/googleRoutes');

 mongoose.connect(process.env.DBURL).then(()=>{
     const app=express();
     app.set('view engine','ejs');
     app.set('views',path.resolve('./views'));
     app.use(
         session({
             secret: process.env.SESSION_SECRET_KEY,
             resave: false,
             saveUninitialized: true,
             cookie: {
                 maxAge: 24 * 60 * 60 * 1000, // 1 day
                 sameSite: 'none', // Allows cross-origin cookies
             }
         })
     );

     app.use(cors({
         origin: 'https://shorturlob.onrender.com',
         credentials: true // Allows cookies and credentials to be sent with requests
     }));

     app.use(cookieParser());
     app.use(express.urlencoded({extended: false}));
     app.use(bodyParse());
     app.use(express.json());
     app.use(passport.initialize());
     app.use(passport.session());
     app.use('/api/static',express.static(path.join(__dirname,'public/images')));
    app.use('/api/shortUrl',checkForAuthentication,router);
    app.use('/api/users',userRouter);
    app.use('/api/google',googleRoutes);
     app.listen(port,()=>console.log(`Server Started at ${port}`));
 }).catch(error=>console.log(error));
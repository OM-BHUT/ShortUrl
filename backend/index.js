require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const router = require('./routes/shortUrlRoutes');
const { bodyParse } = require('./middleWares/index');
const path = require('path');
const { checkForAuthentication } = require('./middleWares/auth');
const userRouter = require('./routes/user');
const mongoose = require('mongoose');
const port = process.env.PORT || 8080;
const cors = require('cors');
const session = require('express-session');
const passport = require('./controllers/passport');
const googleRoutes = require('./routes/googleRoutes');
const { createServer } = require('node:http');
const { initSocket } = require("./services/socket");
const cron = require("node-cron");
const {fetchAnalyticsData} = require("./services/googleAnalytics");

// Connect to MongoDB
mongoose.connect(process.env.DBURL)
    .then(() => {
        const app = express();
        const server = createServer(app);

        // Initialize Socket.IO
        initSocket(server);

        // Session and CORS
        app.use(cors({
            origin: [process.env.COR_URL1, process.env.COR_URL2,process.env.CLIENT_URL],
            credentials: true
        }));
        app.use(cookieParser());
        app.use(
            session({
                secret: process.env.SESSION_SECRET_KEY,
                resave: false,
                saveUninitialized: true,
                cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
            })
        );
            cron.schedule("0 0 * * *", () => { // Runs every day at midnight
                    fetchAnalyticsData()
                        .then(() => console.log("Analytics data fetched successfully"))
                        .catch(err => console.error("Cron job error:", err.message));
            });
        // Body parsing
        app.use(express.urlencoded({ extended: false }));
        app.use(bodyParse());
        app.use(express.json());

        // Passport initialization
        app.use(passport.initialize());
        app.use(passport.session());

        // Static files and routes
        app.use('/api/static', express.static(path.join(__dirname, 'public/images')));
        app.use('/api/shortUrl', checkForAuthentication, router);
        app.use('/api/users', userRouter);
        app.use('/api/google', googleRoutes);

        // Start the server
        server.listen(port, () => console.log(`Server Started at ${port}`));
    })
    .catch(error => console.log(error));

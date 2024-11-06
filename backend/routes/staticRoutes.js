const express = require('express');
const router = express.Router();
const {handleGetHomePage,
    handleLoginPage
} = require('../controllers/staticRouterControllers');
router.get('/',handleGetHomePage);
router.get('/login',handleLoginPage);


module.exports = router;


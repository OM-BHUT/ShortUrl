const express = require('express');
const router = express.Router();
const {
    handleShortRoutes,
    handleRedirectToOriginalUrl,
    handleAnalytics,
    handleGetAll,
    handleDeleteByShortUrl, giveHostName, giveAllUrlsToAdmin,
} = require('../controllers/shortUrlControlls');
const {restrictTo} = require("../middleWares/auth");
router.post('/',handleShortRoutes);
router.get('/',handleGetAll);
router.get('/:shortId',handleRedirectToOriginalUrl);
router.get('/analytics/:shortId',handleAnalytics);
router.delete('/:shortId',handleDeleteByShortUrl);
router.get('/admin/allUrl',restrictTo(['admin']),giveAllUrlsToAdmin);


module.exports = router;
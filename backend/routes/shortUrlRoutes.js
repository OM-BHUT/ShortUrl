const express = require('express');
const router = express.Router();
const {
    handleShortRoutes,
    handleRedirectToOriginalUrl,
    handleAnalytics,
    handleGetAll,
    handleDeleteByShortUrl, giveHostName,
} = require('../controllers/shortUrlControlls');
router.post('/',handleShortRoutes);
router.get('/',handleGetAll);
router.get('/:shortId',handleRedirectToOriginalUrl);
router.get('/analytics/:shortId',handleAnalytics);
router.delete('/:shortId',handleDeleteByShortUrl);


module.exports = router;
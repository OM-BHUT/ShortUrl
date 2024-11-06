// const router = require('../routes/staticRoutes');
const shortUrl = require('../models/shortUrl');

async function handleGetHomePage(req,res){
    if(!req.user) return res.redirect('/login');
    const urls = await shortUrl.find({createdBy: req.user._id});
    return res.render('home',{
        urls:urls, 
    });
}

async function handleLoginPage(req,res){
    return res.render('login');
}

module.exports = {
    handleGetHomePage,
    handleLoginPage
}
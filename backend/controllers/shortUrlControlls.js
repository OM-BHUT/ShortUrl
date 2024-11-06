require('dotenv').config({path:'../.env'});
const router = require('../routes/shortUrlRoutes');
const shortUrl = require('../models/shortUrl');
const shortid = require("shortid");
const path = require('path');
const methodOverride = require('method-override');

async function handleShortRoutes(req,res){
    const body = req.body;
    if(!body.shortUrl) return res.status(400).json({error: 'please enter valid url'});
        const newShortUrl= shortid();
        console.log('from handleShortRoutes')
        console.log(req.user)
        const newUrl = await shortUrl.create({
            shortId:newShortUrl,
            redirectUrl: body.shortUrl,
            details: [],
            createdBy: req.user._id,
        });
        return res.send(newUrl);
}

async function handleRedirectToOriginalUrl(req,res){
    console.log('from handleRedirectToOriginalUrl')
    console.log(req.params)
    const url = req.params.shortId;
    const urlObj = await shortUrl.findOneAndUpdate({
            shortId:url,
    },{
        $push:{
            details:{
                timestamp:Date.now(),
            }
        }
    }
    );
    if (!urlObj) {
        return res.status(400).json({error:true,message:'no user found'})
    }
    console.log(urlObj)
    const redirectUrl = urlObj.redirectUrl.startsWith('http')
        ? urlObj.redirectUrl
        : `http://${urlObj.redirectUrl}`;

    return  res.redirect(redirectUrl);
}

async function handleAnalytics(req,res){
    const url = req.params.shortId;
    const urlObj = await shortUrl.findOne({
        shortId:url,
    });
    return res.send(
        {link:urlObj._doc.redirectUrl, length: urlObj.details.length}
    );
}
// get all
async function handleGetAll(req,res){
    const url = await shortUrl.find({createdBy: req.user?._id});
    if (!url){
        return res.status(404).json({error:'urls not founded'});
    }
    return res.send(url);
};



async function handleDeleteByShortUrl(req,res){
    const {shortId} = req.params;
    if(!shortId) return res.status(404).json({error:true,message:'Url Not Found'});
    const deletedUrl = await shortUrl.findOneAndDelete({shortId});
    return res.send(deletedUrl);
}



module.exports = {
    handleShortRoutes,
    handleRedirectToOriginalUrl,
    handleAnalytics,
    handleGetAll,
    handleDeleteByShortUrl,
}
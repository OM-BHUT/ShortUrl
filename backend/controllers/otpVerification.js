const bcrypt = require('bcryptjs');
const {sendVerificationEmail, sendWelcomeEmail} = require("../middleWares/email");
const User = require('../models/users');
const {setUser, getUser} = require("../services/auth");



async function handleRegister(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "Enter all details" });
        }

        const existUser = await User.findOne({ email });
        const verificationToken = Math.floor(1000 + Math.random() * 9000).toString();

        if (existUser) {
            if (!existUser.isVerified) {
                // Update existing unverified user
                existUser.password = await bcrypt.hash(password, 10);
                existUser.name = name;
                existUser.verificationToken = verificationToken;
                existUser.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

                await existUser.save();
                await sendVerificationEmail(email, verificationToken);

                return res.status(200).send({ email });
            }

            return res.status(400).json({ success: false, message: "User already exists, please login" });
        }

        // Create a new user
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        await user.save();
        await sendVerificationEmail(email, verificationToken);

        return res.status(201).send({ email});
    } catch (error) {
        console.error('Error in handleRegister:', error);
        res.status(500).json({ success: true, message: "Error registering user" });
    }
}


async function verifyEmail(req,res){
    try {
        const {code} = req.body;
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })
        if (!user){
            return res.status(400).json({ success: false, message: 'User not exist or token expired' });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email,user.name);
        return res.status(200).json({message: 'user verified'});
    }catch (error){
        console.log('verifyEmail error ',error);
    }
}


async function giveEmailInfo(req,res){
    const token = req.cookies?.userId;
    if (!token) {
        return res.redirect('/login');
    }
    const user = getUser(token);
    return res.send(user.email);
}

async function resendOtp(req,res){
    try {
    const token = req.cookies?.userId;
    if (!token){
        return res.status(404).json({error:'no token'});
    }
    const user = getUser(token);
    const {email} = user;
    const verificationToken = Math.floor(1000+Math.random()*9000).toString();
    const userFromDb = await User.findOne({
        email:email
    });
    if (!userFromDb){
        return res.status(400).json({error:'user Not Found please signUp again'});
    }
    userFromDb.verificationToken = verificationToken;
    await userFromDb.save();
    await sendVerificationEmail(email,verificationToken);
    return res.json({message:'otp sent successfully'});
    }catch (e) {
        console.log('error ',e)
        return res.json({error:e});
    }

}

module.exports ={
    handleRegister,
    verifyEmail,
    giveEmailInfo,
    resendOtp
}


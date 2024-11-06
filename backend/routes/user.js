const express = require('express');
const router = express.Router();
const {handleUserSignUp,
    handleUserLogin,
    showSignUp, handleTokenUser, handleTokenUserGoogle, giveInfo, giveTokenInfo, handleLogOut, giveHostName,
    handleForgetPass, changeProfilePicture, handleSetToDefault, changeName,
} = require('../controllers/user');
const {handleRegister, giveEmailInfo, verifyEmail, resendOtp} = require("../controllers/otpVerification");
const {sendVerificationEmail} = require("../middleWares/email");
const upload = require('../middleWares/multer.middleware');

router.post('/',handleRegister);
router.post('/verify',verifyEmail);
router.post('/login',handleUserLogin);
router.post('/logOut',handleLogOut);
router.get('/emailInfo',giveEmailInfo);
router.get('/resendOtp',resendOtp);
router.get('/giveTokenInfo',giveTokenInfo);
router.get('/hostAddress',giveHostName);
router.get('/isVerified',handleTokenUser);
router.get('/isVerified/google',handleTokenUserGoogle);
router.patch('/forgetPass',handleForgetPass);
router.post('/profilePicture',upload.single('profilePicture'),changeProfilePicture);
router.delete('/setToDefaultPicture',handleSetToDefault);
router.patch('/changeName',changeName);
// router.get('/signup',showSignUp);
// router.get('/',);

module.exports = router;
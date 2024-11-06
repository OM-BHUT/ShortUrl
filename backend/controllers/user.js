const User = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const { setUser, getUser } = require("../services/auth");
const bcryptjs = require('bcryptjs');
const GoogleUsers = require('../models/GoogleUsers');
const {sendVerificationEmail} = require("../middleWares/email");
const {verifyEmail} = require("./otpVerification");
const bcrypt = require("bcryptjs");
const {uploadOnCloudinary} = require("../services/cloudinary");
const {giveUserFromDb} = require("../services/giveUser");

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  return res.render("home");
}



async function handleUserLogin(req, res) {
  console.log('from handleUserLogin');
  const { email, password } = req.body;
  console.log('email = '+email);
  console.log('pass = '+password);
  const user = await User.findOne({ email });

  if (!user) {
    console.log('!user');
    return res.status(400).json({error:true,message:'user not found'});
  }
  const hashPasswordFromDb = user.password;

  const isPassCorrect = bcryptjs.compareSync(password,hashPasswordFromDb);

  if (!isPassCorrect){
    return res.status(400).json({error:true,message:'password not correct'});
  }

  if (!user.isVerified){
    return res.status(404).json({message:'not verified please signUp again or click forget password to verify'});
  }

  const token = setUser(user);
  res.cookie("userId", token);
  return res.send(user);
}
            
async function showSignUp(req, res) {
  return res.redirect("/signUp");
}

async function giveAllInfo(req,res){
  const token = req.cookies?.userId;
  if (!token){
    return res.status(400).json({error:'token not found'});
  }
  const user = getUser(token);

  if (!user){
    return res.status(400).json({error:'user not signedUp'});
  }

  const userInfo = await User.findOne({
    _id:user._id,
    email: user.email
  });

}

async function handleTokenUser(req,res){
  try {
    const token = req.cookies?.userId;
    if (!token){
      return res.status(400).json({message:'no Token'});
    }
    const user = getUser(token);

    if (!user){
      res.clearCookie('userId');
      return res.status(400).json({message:'user Not Found'})
    }
    const userInfo = await User.findOne({
      _id:user._id,
      email: user.email
    });

    if (!userInfo){
      res.clearCookie('userId');
      return res.status(400).json({message:'user Not Found In Db'})
    }
    // const {email,name} = userInfo;

    return res.status(200).send(userInfo);

  }catch (e) {
    console.log('error ',e);
  }
}

async function handleTokenUserGoogle(req,res){
  try {
    const token = req.cookies?.userId;
    if (!token){
      return res.status(400).json({message:'no Token'});
    }
    const user = getUser(token);

    if (!user){
      res.clearCookie('userId');
      return res.status(400).json({message:'user Not Found'})
    }
    const userInfo = await GoogleUsers.findOne({
      _id:user._id,
      email: user.email
    });

    if (!userInfo){
      res.clearCookie('userId');
      return res.status(400).json({message:'user Not Found In Db'})
    }
    const {email,name,profilePicture} = userInfo;

    return res.status(200).send(userInfo);

  }catch (e) {
    console.log('error ',e);
  }
}

async function giveHostName(req,res){
  console.log('from giveHostName');
  const host = req.get('host');
  console.log(host);
  return res.send(host);
}

async function handleLogOut(req,res){
   res.clearCookie('userId');
  res.status(200).json({message:'user logged Out Successfully'});
}

// async function giveInfo(req,res){
//   console.log('from giveInfo');
//   const token = req.cookies.userId;
//   if (!token){
//     return res.status(401).json({message:'not authorized'});
//   }
//   const user = getUser(token);
//   if (!user){
//     return res.status(401).json({message:'not authorized'});
//   }
//   const dbToUse = user.userType === 'google' ? GoogleUsers : User;
//
//   console.log(dbToUse)
//
//   const userInfo = await dbToUse.findOne({
//     _id:user._id,
//     email: user.email
//   });
//
//   console.log('userInfo = '+userInfo)
//   if (!userInfo){
//     return res.status(404).json({message: 'user not found in db'});
//   }
//   return res.send(userInfo);
// }

async function giveTokenInfo(req,res){

  console.log('from giveTokenInfo');
  const token = req.cookies.userId;
  if (!token){
    return res.status(401).json({message:'not authorized'});
  }
  const user = getUser(token);
  if (!user){
    return res.status(401).json({message:'not authorized'});
  }
  return res.send(user);
}

async function handleForgetPass(req,res){
    try {
      const {email,password} = req.body;
      const user = await User.findOne({email});
      if (!user){
        return res.status(404).json({message:'user not found'});
      }
      const verificationToken = Math.floor(1000 + Math.random() * 9000).toString();
      user.verificationToken = verificationToken;
      user.password = await bcrypt.hash(password, 10);
      user.isVerified = false;
      user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
      await user.save();
      await sendVerificationEmail(email,verificationToken);
      return res.status(200).json({message: 'user updated'});
    }catch (e) {
      return res.status(400).json({message: 'some error occurred'});
    }
}

async function changeProfilePicture(req,res){
  try {
    console.log('from changeProfilePicture');
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
      const user = await giveUserFromDb(req.cookies.userId);
      if (!user){
        return res.status(400);
      }
    console.log('req.profilePicture = '+req.file);
    const localFilePath = req.file.path; // Path to the uploaded file in ./public/temp
    const response = await uploadOnCloudinary(localFilePath,`profile_pictures/${user._id}`);
    if (response) {
      user.profilePicture = response.url;
      await user.save();
      res.status(200).json({
        message: 'File uploaded successfully to Cloudinary',
        url: response.url
      });
    } else {
      res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'An error occurred while uploading the file' });
  }
}


async function handleSetToDefault(req,res){
  try{
    const user = await giveUserFromDb(req.cookies.userId);
    if (!user){
      return res.status(404);
    }
    const defaultImg = await User.schema.path('profilePicture').default();
    user.profilePicture = defaultImg;
    await user.save();
    return res.status(200).send({defaultUrl : defaultImg});
  }catch (e) {
    console.log('err',e);
  }
}

async function changeName(req,res){
  try{
  const user = await giveUserFromDb(req.cookies.userId);
  if (!user){
    return res.status(404);
  }
    console.log('user ',user);
    console.log(req.body)
  user.name = req.body.name;

  await user.save();
  return res.status(200).json({message:'updated name successfully'});

  }catch (e) {
    console.log('error ',e);
  }
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  showSignUp,
  handleTokenUser,
  handleTokenUserGoogle,
  giveTokenInfo,
  handleLogOut,
  giveHostName,
  handleForgetPass,
  changeProfilePicture,
  handleSetToDefault,
  changeName
};

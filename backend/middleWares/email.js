require('dotenv').config({path:'../.env'});
const {transporter} = require('./email.config');


async function sendVerificationEmail(email,verification) {
    // send mail with defined transport object
    try {
        const info = await transporter.sendMail({
            from: '"OmPatel" <process.env.EMAILFV>', // sender address
            to: email, // list of receivers
            subject: "Verify Your Email", // Subject line
            text: "Verify Your Email", // plain text body
            html: "<h1>"+verification+"</h1>", // html body
        });
        

    }catch (error){
        console.log('email error '+error);
    }
}

async function sendWelcomeEmail(email,name){
    try{
        const response = await transporter.sendMail({
            from: '"OmPatel" <process.env.EMAILFV>', // sender address
            to: email, // list of receivers
            subject: "Welcome Email", // Subject line
            text: "Welcome Email", // plain text body
            html: "<h1>Welcome To Url Shortener</h1>", // html body
        });

    }catch (e) {
        console.log('error at welcome = '+e)
    }
}

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail
}
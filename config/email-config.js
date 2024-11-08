const nodemailer = require('nodemailer');

let NodeMailer_Transporter = nodemailer.createTransport({
    host: 'smtp.ionos.com',
    port: 587,
    secure: false,
    
    auth: {
        user: process.env.ADMIN_EMAIL_SENDER_USER,
        pass: process.env.ADMIN_EMAIL_SENDER_PASS
    }
});


module.exports = NodeMailer_Transporter;
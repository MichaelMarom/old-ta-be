const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { sendErrors } = require('../helperfunctions/handleReqErrors');
require('dotenv').config()

// Send email function
const sendEmail = async (to, subject, template, context) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.ADMIN_EMAIL_SENDER_USER,
            pass: process.env.ADMIN_EMAIL_SENDER_PASS
        }
    });

    const handlebarOptions = {
        viewEngine: {
            extName: '.hbs',
            partialsDir: path.join(__dirname, '../templates/chat'),
            defaultLayout: false,
        },
        viewPath: path.join(__dirname, '../templates/chat'),
        extName: '.hbs',
    };
    
    // Use a template with nodemailer
    transporter.use('compile', hbs(handlebarOptions));

    const mailOptions = {
        from: process.env.ADMIN_EMAIL_SENDER_USER,
        to,
        subject,
        template,
        context,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent to:', info.accepted.join(', '));
        return info.accepted
    } catch (error) {
        console.error('Error sending email to', to, ':', error.message);
        throw new Error(error)
    }
};

// // Example usage
// sendEmail('recipient@example.com', 'Welcome!', 'welcome', {
//   name: 'John Doe',
//   company: 'ACME Corp',
// });


async function sendTemplatedEmail(req, res) {
    try {
        let { email, messages, files, subject } = req.body
        let data = await sendEmail(email, "New Message From Asiya", 'newMessage', {
            messages
        });
        res.status(200).send(data)
    }
    catch (err) {
        sendErrors(err, res)
    }
}

module.exports = sendTemplatedEmail



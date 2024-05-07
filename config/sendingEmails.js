const nodemailer = require('nodemailer');
const { sendErrors } = require('../helperfunctions/handleReqErrors');

// Function to send email
async function sendEmail(email, message) {
    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        // Specify your email service provider and authentication details
        host: 'smtp.ionos.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'admin@tutoring-academy.com',
            pass: '43Naomiionos'
        }
    });

    // Email options
    let mailOptions = {
        from: 'admin@tutoring-academy.com',
        to: email,
        subject: 'Marketing',
        html: message
    };

    // Send email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent to:', info.accepted.join(', '));
        return info.accepted
    } catch (error) {
        console.error('Error sending email to', email, ':', error.message);
        throw new Error(error)
    }
}

// Function to send 200 emails
async function sendMultipleEmails(req, res) {
    try {
        let { emails, message } = req.body
        emails.push('asiya.batool987@gmail.com')
        let data;
        for (let email of emails) {
            data = await sendEmail(email, message);
        }
        res.status(200).send(data)
    }
    catch (err) {
        sendErrors(err, res)
    }
}

module.exports = sendMultipleEmails

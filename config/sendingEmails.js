const nodemailer = require('nodemailer');
const { sendErrors } = require('../helperfunctions/handleReqErrors');
const fs = require('fs');
const path = require('path');


// Function to send email
async function sendEmail(email, message, subject) {
    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        // Specify your email service provider and authentication details
        host: 'smtp.ionos.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.ADMIN_EMAIL_SENDER_USER,
            pass: process.env.ADMIN_EMAIL_SENDER_PASS
        }
    });
    const templatePath = path.join(__dirname, '../templates/student-marketing/new-template.html');
    const imagesPath = path.join(__dirname, '../templates/student-marketing/images');

    // Read HTML file
    const emailHtml = fs.readFileSync(templatePath, 'utf8');

    // Get all image files from the images directory
    const imageFiles = fs.readdirSync(imagesPath);

    // Prepare attachments array
    const attachments = imageFiles.map(file => ({
        filename: file,
        path: path.join(imagesPath, file),
        cid: file.replace(/\..+$/, '') // Use filename without extension as CID
    }));
    console.log(attachments)
    // Email options
    let mailOptions = {
        from: process.env.ADMIN_EMAIL_SENDER_USER,
        to: email,
        subject,
        html: emailHtml,
        attachments
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
        let { emails, message, subject } = req.body
        emails.push('asiya.batool987@gmail.com')
        let data;
        for (let email of emails) {
            data = await sendEmail(email, message, subject);
        }
        res.status(200).send(data)
    }
    catch (err) {
        sendErrors(err, res)
    }
}

module.exports = sendMultipleEmails

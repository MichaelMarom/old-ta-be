const nodemailer = require('nodemailer');
const { sendErrors } = require('../utils/handleReqErrors');
const fs = require('fs');
const path = require('path');
const NodeMailer_Transporter = require('./email-config');



async function sendEmail(email, message, subject) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,

        auth: {
            user: process.env.ADMIN_EMAIL_SENDER_USER,
            pass: process.env.ADMIN_EMAIL_SENDER_PASS
        }
    });

    const templatePath = path.join(__dirname, '../templates/student-marketing/new-template.html');
    const imagesPath = path.join(__dirname, '../templates/student-marketing/images');
    const generalImagesPath = path.join(__dirname, '../templates/general/images');

    const prefixedMessageWithLogo = `<div style="text-align:center">
    <img src="cid:logo" alt="Trulli" width="400" height="100" >
    </div> ${message}`
    // Read HTML file
    const emailHtml = fs.readFileSync(templatePath, 'utf8');

    // Get all image files from the images directory
    // const imageFiles = fs.readdirSync(imagesPath);

    // // Prepare attachments array
    // const attachments = imageFiles.map(file => ({
    //     filename: file,
    //     path: path.join(imagesPath, file),
    //     cid: file.replace(/\..+$/, '') // Use filename without extension as CID
    // }));


    console.log(message)
    // Email options
    let mailOptions = {
        from: process.env.ADMIN_EMAIL_SENDER_USER,
        to: email,
        subject,
        html: prefixedMessageWithLogo,
        attachments: [{
            filename: 'logo1',
            path: path.join(generalImagesPath, 'logo1.png'),
            cid: 'logo'
        }]
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


const getEmailTemplate = () => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '../templates', 'tutor-marketing', 'marketing.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

async function sendTemplatedEmail(req, res) {
    try {
        const { emails, subject, htmlTemplate } = req.body;
        if (!htmlTemplate) throw new Error('Failed to open email template');
        if (!emails || !subject) throw new Error('Missing required fields: emails, subject');

        // Compose the email
        const mailOptions = {
            from: process.env.ADMIN_EMAIL_SENDER_USER,  // Your email
            to: emails.join(', '),         // Send to multiple emails
            subject: subject,              // Subject passed from frontend
            html: htmlTemplate,         // Use the decoded HTML template
        };

        // Send email using nodemailer
        NodeMailer_Transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return sendErrors(error, res);
            }
            res.status(200).json({ message: 'Email sent successfully', info });
        });
    } catch (err) {
       sendErrors(err, res)
    }
}

module.exports = { sendMultipleEmails, sendTemplatedEmail }

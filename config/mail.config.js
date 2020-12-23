let nodemailer = require('nodemailer');
require('dotenv').config();

exports.SMTPTransport = nodemailer.createTransport({
    host: process.env.SMTP_SERVICE_HOST,
    port: process.env.SMTP_SERVICE_PORT,
    secure: process.env.SMTP_SERVICE_SECURE, // upgrade later with STARTTLS
    debug: true,
    auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_USER_PASSWORD
    }
});

exports.ViewOption = (transport, hbs) => {
    transport.use('compile', hbs({
        viewPath: 'views/email',
        extName: '.hbs'
    }));
}
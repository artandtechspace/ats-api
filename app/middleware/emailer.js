const nodemailer = require('nodemailer')
const i18n = require('i18n')
const User = require('../models/user')
const {buildErrObject} = require("./utils");
const {itemAlreadyExists} = require('../middleware/utils')

/**
 * Sends email
 * @param {Object} data - data
 * @param {function(*): void} callback - callback
 */
const sendEmail = async (data = {}, callback) => {
    const auth = {
        host: process.env.EMAIL_SMTP_DOMAIN_HOST, // smtp host for sending
        port: process.env.EMAIL_SMTP_PORT, // secure false
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_SMTP_USER, // generated ethereal user
            pass: process.env.EMAIL_SMTP_PASS, // generated ethereal password
        },
    }

    const transporter = nodemailer.createTransport(auth)
    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
        to: `${data.user.name} <${data.user.email}>`,
        subject: data.subject,
        html: data.htmlMessage
    }
    transporter.sendMail(mailOptions, err => {
        if (err) {
            return callback(false)
        }
        return callback(true)
    })
}

/**
 * Prepares to send email
 * @param {string} user - user object
 * @param {string} subject - subject
 * @param {string} htmlMessage - html message
 */
const prepareToSendEmail = (user = {}, subject = '', htmlMessage = '') => {
    user = {
        name: user.name,
        email: user.email,
        verification: user.verification
    }
    const data = {
        user,
        subject,
        htmlMessage
    }
    if (process.env.NODE_ENV === 'production') {
        sendEmail(data, (messageSent) =>
            messageSent
                ? console.log(`Email SENT to: ${user.email}`)
                : console.log(`Email FAILED to: ${user.email}`)
        )
    } else if (process.env.NODE_ENV === 'development') {
        console.log(data)
    }
}

module.exports = {
    /**
     * Checks User model if user with an specific email exists
     * @param {string} email - user email
     */
    async emailExists(email) {
        return new Promise((resolve, reject) => {
            User.findOne(
                {
                    email
                },
                (err, item) => {
                    if (err) return reject(buildErrObject(422, err.message))
                    if (item) return reject(buildErrObject(422, 'EMAIL_ALREADY_EXISTS'))
                    resolve(false)
                }
            )
        })
    },

    /**
     * Checks User model if user with an specific email exists but excluding user id
     * @param {string} id - user id
     * @param {string} email - user email
     */
    async emailExistsExcludingMyself(id, email) {
        return new Promise((resolve, reject) => {
            User.findOne(
                {
                    email,
                    _id: {
                        $ne: id
                    }
                },
                (err, item) => {
                    if (err) return reject(buildErrObject(422, err.message))
                    if (item) return reject(buildErrObject(422, 'EMAIL_ALREADY_EXISTS'))
                    resolve(false)
                }
            )
        })
    },

    /**
     * Sends registration email
     * @param {string} locale - locale
     * @param {Object} user - user object
     */
    async sendRegistrationEmailMessage(locale = '', user = {}) {
        i18n.setLocale(locale)
        const subject = i18n.__('registration.SUBJECT')
        const htmlMessage = i18n.__(
            'registration.MESSAGE',
            user.name,
            process.env.FRONTEND_URL,
            user.verification
        )
        prepareToSendEmail(user, subject, htmlMessage)
    },

    async sendChangeEmailMessage(locale = '', user = {}) {
        i18n.setLocale(locale)
        const subject = i18n.__('changeEmail.SUBJECT')
        const htmlMessage = i18n.__(
            'changeEmail.MESSAGE',
            user.name,
            user.changeEmail,
            process.env.FRONTEND_URL,
            user.verification
        )
        prepareToSendEmail(user, subject, htmlMessage)
    },

    /**
     * Sends reset password email
     * @param {string} locale - locale
     * @param {Object} user - user object
     */
    async sendResetPasswordEmailMessage(locale = '', user = {}) {
        i18n.setLocale(locale)
        const subject = i18n.__('forgotPassword.SUBJECT')
        const htmlMessage = i18n.__(
            'forgotPassword.MESSAGE',
            user.email,
            process.env.FRONTEND_URL,
            user.verification
        )
        prepareToSendEmail(user, subject, htmlMessage)
    }
}

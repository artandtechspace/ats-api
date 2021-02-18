const mongoose = require('mongoose')
const validator = require('validator')

const UserAccessSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            validate: {
                validator: validator.isEmail,
                message: 'EMAIL_IS_NOT_VALID'
            },
            lowercase: true,
            required: true
        },
        userid: {
            type: String,
            required: true
        },
        userNameCache: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: false
        },
        browser: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.model('UserAccess', UserAccessSchema)

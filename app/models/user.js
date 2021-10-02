const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')
const {buildErrObject} = require("../middleware/utils");

const UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        secondFirstname: {
            type: String,
            required: false
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            validate: {
                validator: validator.isEmail,
                message: 'EMAIL_IS_NOT_VALID'
            },
            lowercase: true,
            unique: true,
            required: true
        },
        changeEmail: {
            type: String,
            validate: {
                validator: validator.isEmail,
                message: 'EMAIL_IS_NOT_VALID'
            },
            lowercase: true,
            unique: true,
            sparse: true
        },
        adUuid: {
            type: String,
            required: true,
            unique: true,
        },
        desfireSecret: {
            type: String,
            required: false,
            unique: true,
            select: false
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'member'],
            default: 'user'
        },
        verification: {
            type: String
        },
        verifiedCEmail: {
            type: Boolean,
            default: false
        },
        verified: {
            type: Boolean,
            default: false
        },
        birthday: {
            type: String,
            required: false
        },
        phone: {
            type: String
        },
        customerId: {
            type: String,
        },
        addressId: {
            type: String
        },
        idGitHub: {
            type: String,
            validate: {
                validator: validator.isEmail,
                message: 'EMAIL_IS_NOT_VALID'
            },
            lowercase: true,
            unique: true,
            sparse: true
        },
        loginAttempts: {
            type: Number,
            default: 0,
            select: false
        },
        blockExpires: {
            type: Date,
            default: Date.now,
            select: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)
/**
 * Replaceses the password and desfireSecret with salted hash
 * @module userShemaMiddelware
 * @function
 * @param {Object} user
 * @param {number} salt
 * @param {Function} next
 */
const hash = async (user, salt, next) => {
    if (user.isModified('password')) {
        await bcrypt.hash(user.password, salt, (error, newHash) => {
            if (error) {
                return next(error)
            }
            user.password = newHash
        })
    }
    if (user.isModified('desfireSecret')) {
        await bcrypt.hash(user.desfireSecret, salt, (error, newHash) => {
            if (error) {
                return next(error)
            }
            user.desfireSecret = newHash
        })
    }
    return next()
}

/**
 * Generates a hash with user infomation and hash function
 * @module userShemaMiddelware
 * @function
 * @param {Object} user
 * @param {number} SALT_FACTOR
 * @param {Function} next
 */
const genSalt = (user, SALT_FACTOR, next) => {
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) {
            return next(err)
        }
        return hash(user, salt, next)
    })
}

UserSchema.pre('save', function (next) {
    const that = this
    const SALT_FACTOR = 5
    if (!that.isModified('password') || !that.isModified('desfireSecret')) return next()
    return genSalt(that, SALT_FACTOR, next)
})

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
    console.log(this.password, passwordAttempt)
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
        err ? cb(err) : cb(null, isMatch)
    ).catch((err) => console.log(err))
}

UserSchema.methods.compareDesfireSecret = function (desfireSecretAttempt, cb) {
    bcrypt.compare(desfireSecretAttempt, this.desfireSecret, (err, isMatch) =>
        err ? cb(err) : cb(null, isMatch)
    )
}

UserSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserSchema)

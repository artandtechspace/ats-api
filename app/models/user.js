const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')
const UserPermissionSchema = require('./userPermission')
const UserPermissionRevokeSchema = require('./userPermissionRevoke')

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
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'member'],
            default: 'user'
        },
        permissions: [UserPermissionSchema],
        permissionsRevoke: [UserPermissionRevokeSchema],
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
        idDiscord: {
            type: String,
            lowercase: true
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

const hash = (user, salt, next) => {
    bcrypt.hash(user.password, salt, (error, newHash) => {
        if (error) {
            return next(error)
        }
        user.password = newHash
        return next()
    })
}

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
    if (!that.isModified('password')) {
        return next()
    }
    return genSalt(that, SALT_FACTOR, next)
})

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
        err ? cb(err) : cb(null, isMatch)
    )
}

UserSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserSchema)

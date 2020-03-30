const mongoose = require('mongoose');
const validator = require('validator');
const upash = require('upash');
const jwt = require('jsonwebtoken');
const {detect} = require('detect-browser');
const browser = detect();

upash.install('argon2', require('@phc/argon2'));

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 4
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email address')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: value => {
            if (!validator.isLength(value, {min: 8, max: undefined})) {
                throw new Error('Password: min 8')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        },
        browserName: {
            type: String,
            default: browser.name,
        },
        browserVersion: {
            type: String,
            default: browser.version,
        },
        browserOs: {
            type: String,
            default: browser.os,
        },
        date: {
            type: Date,
            default: Date.now(),
            required: false
        }
    }],
    groups: [{
        Object: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now(),
            required: false
        }
    }]
});

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this;
    if (user.isModified('password')) {
        user.password = await upash.hash(user.password)
    }
    next()
});

userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token
};

userSchema.methods.addGroup = async function () {
    // Generate an auth token for the user

    return token;
};

userSchema.methods.hashPassword = async function () {
    // Hash an password for the user
    const user = this;
    return await upash.hash(user.password);
};

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({email});
    if (!user) {
        throw new Error({error: 'Invalid login credentials'})
    }
    const isPasswordMatch = await upash.verify(user.password, password);
    if (!isPasswordMatch) {
        throw new Error({error: 'Invalid login credentials'})
    }
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
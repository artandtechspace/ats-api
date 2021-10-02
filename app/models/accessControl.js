const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-paginate-v2");

const accessControlSchema = new mongoose.Schema({
    // Display Name for App ore some else
    name: {
        type: String,
        required: true,
        unique: true
    },
    // Display description for detaild informations about Controled asset
    longDescription: {
        type: String,
    },
    // Hardware Configured 8 Bit code on ControleBoard converted Integer
    macAddress: {
        type: String,
        required: true,
        unique: true
    },
    deviceSecret: {
        type: String,
        required: true,
        unique: true
    },
    adGroupId: {
        type: String,
        required: true,
    },
    // ControleBoard Configuration
    configuration: {
        dhcp: {
            type: Boolean,
            default: true,
        },
        localIP: {
            type: String,
            lowercase: true,
            unique: true
        },
        subnetIP: {
            type: String,
            lowercase: true
        },
        gatewayIP: {
            type: String,
            lowercase: true
        },
        dnsIP: {
            type: String,
            lowercase: true,
        },
        hostname: {
            type: String,
            unique: true
        },
        //In VA->Watt
        standbyUseVA: {
            type: Number,
        },
        //In VA->Watt
        normalUseVA: {
            type: Number,
        }
    }
})

/**
 * Replaceses the password and desfireSecret with salted hash
 * @module accessControlShemaMiddelware
 * @function
 * @param {Object} accessControl
 * @param {number} salt
 * @param {Function} next
 */
const hash = async (accessControl, salt, next) => {
    await bcrypt.hash(accessControl.deviceSecret, salt, (error, newHash) => {
        if (error) {
            return next(error)
        }
        accessControl.deviceSecret = newHash
    })
    return next()
}

/**
 * Generates a hash with accessControl infomation and hash function
 * @module accessControlShemaMiddelware
 * @function
 * @param {Object} accessControl
 * @param {number} SALT_FACTOR
 * @param {Function} next
 */
const genSalt = (accessControl, SALT_FACTOR, next) => {
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) {
            return next(err)
        }
        return hash(accessControl, salt, next)
    })
}

accessControlSchema.pre('save', function (next) {
    const that = this
    const SALT_FACTOR = 5
    if (!that.isModified('deviceSecret')) return next()
    return genSalt(that, SALT_FACTOR, next)
})

accessControlSchema.methods.compareDeviceSecret = function (deviceSecretAttempt, cb) {
    bcrypt.compare(deviceSecretAttempt, this.deviceSecret, (err, isMatch) =>
        err ? cb(err) : cb(null, isMatch)
    )
}

accessControlSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('AccessControl', accessControlSchema)

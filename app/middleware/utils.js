const requestIp = require('request-ip')
const {validationResult} = require('express-validator')
const bson = require('bson')
const crypto = require("crypto");


buildErrObject = (code = '', message = {}) => {
    return {
        code,
        message
    }
}

/**
 * Removes extension from file
 * @param {string} file - filename
 */
exports.removeExtensionFromFile = (file) => {
    return file.split('.').slice(0, -1).join('.').toString()
}

/**
 * Gets IP from user
 * @param {*} req - request object
 */
exports.getIP = (req) => requestIp.getClientIp(req)

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
exports.getBrowserInfo = ({headers}) => headers['user-agent']

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
exports.getCountry = ({headers}) =>
    headers['cf-ipcountry'] ? headers['cf-ipcountry'] : 'XX'

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res = {}, err = {}) => {
    // Prints error in console
    if (process.env.NODE_ENV === 'development') {
        console.log(err)
    }
    // Sends error to user
    res.status(err.code).json({
        errors: {
            msg: err.message
        }
    })
}

/**
 * Builds error object
 * @param {string} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code = '', message = {}) => {
    return {
        code,
        message
    }
}

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
exports.validationResult = (req, res, next) => {
    try {
        validationResult(req).throw()
        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase()
        }
        return next()
    } catch (err) {
        return this.handleError(res, this.buildErrObject(422, err.array()))
    }
}

/**
 * Builds success object
 * @param {string} message - success text
 */
exports.buildSuccObject = (message = "") => {
    return {
        msg: message
    }
}

/**
 * Checks if given ID is good for MongoDB
 * @param {string} id - id to check
 */
exports.isIDGood = async (id = '') => {
    return new Promise((resolve, reject) => {
        const goodID = mongoose.Types.ObjectId.isValid(id)
        return goodID ? resolve(id) : reject(buildErrObject(422, 'ID_MALFORMED'))
    })
}

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemNotFound = (err = {}, item = {}, message = {}) => {
    return new Promise((resolve, reject) => {
        if (err) {
            return reject(buildErrObject(422, err.message))
        }
        if (!item) {
            return reject(buildErrObject(404, message))
        }
        resolve()
    })
}

/**
 * Item already exists
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemAlreadyExists = (err, item, reject, message) => {
    if (err) {
        reject(this.buildErrObject(422, err.message))
    }
    if (item) {
        reject(this.buildErrObject(422, message))
    }
}

exports.datePlusHoursOlder = (date, hours) => {
    if (new Date(date.getTime() + hours) >= Date.now()) {
        console.log(true)
        return true
    }
}

exports.getFullName = (user) => {
    if (user.secondFirstname) return user.firstname + " " + user.secondFirstname + " " + user.lastname
    else return user.firstname + " " + user.lastname
}

exports.createSecret = async () => {
    return new Promise(async (resolve, reject) => {
        const token = crypto.randomBytes(16).toString('hex');
        return resolve(token)
    })
}

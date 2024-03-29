const model = require('../models/user')
const utils = require('../middleware/utils')
const {matchedData} = require('express-validator')
const auth = require('../middleware/auth')
const emailer = require('../middleware/emailer')
const uuid = require('uuid')

/*********************
 * Private functions *
 *********************/

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
const getProfileFromDB = async id => {
    return new Promise((resolve, reject) => {
        model.findById(id, '-_id -updatedAt -createdAt', (err, user) => {
            utils.itemNotFound(err, user, 'NOT_FOUND')
            resolve(user)
        })
    })
}

/**
 * Updates profile in database
 * @param {Object} req - request object
 * @param {string} id - user id
 */
const updateProfileInDB = async (req, id) => {
    return new Promise((resolve, reject) => {
        if (req.email) {
            req.changeEmail = req.email
            delete req.email
        }
        model.findByIdAndUpdate(
            id,
            req,
            {
                new: true,
                runValidators: true,
                select: '-role -_id -updatedAt -createdAt'
            },
            (err, user) => {
                utils.itemNotFound(err, user, 'NOT_FOUND')
                resolve(user)
            }
        )
    })
}

/**
 * Finds user by id
 * @param {string} email - user id
 */
const findUser = async id => {
    return new Promise((resolve, reject) => {
        model.findById(id, (err, user) => {
            utils.itemNotFound(err, user, 'USER_DOES_NOT_EXIST')
            resolve(user)
        })
    })
}

/**
 * Build passwords do not match object
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async () => {
    return new Promise(resolve => {
        resolve(utils.buildErrObject(409, 'WRONG_PASSWORD'))
    })
}

/**
 * Changes password in database
 * @param {string} id - user id
 * @param {Object} req - request object
 */
const changePasswordInDB = async (id, req) => {
    return new Promise((resolve, reject) => {
        model.findById(id, '+password', (err, user) => {
            utils.itemNotFound(err, user, 'NOT_FOUND')

            // Assigns new password to user
            user.password = req.newPassword

            // Saves in DB
            user.save(error => {
                if (err) {
                    reject(utils.buildErrObject(422, error.message))
                }
                resolve(utils.buildSuccObject('PASSWORD_CHANGED'))
            })
        })
    })
}

/********************
 * Public functions *
 ********************/

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getProfile = async (req, res) => {
    try {
        const id = await utils.isIDGood(req.user._id)
        res.status(200).json(await getProfileFromDB(id))
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateProfile = async (req, res) => {
    try {
        // Gets locale from header 'Accept-Language'
        const locale = req.getLocale()
        const id = await utils.isIDGood(req.user._id)
        // Gets only req.body
        req = matchedData(req)
        if (req.email) {
            const doesEmailExists = await emailer.emailExists(req.email)
            if (!doesEmailExists) {
                const verification = await findUser(id)
                if (verification.verifiedCEmail) {
                    const id = "v:" + uuid.v4()
                    req.verification = id
                    verification.verification = auth.encrypt(id)
                } else {
                    const id = "vEC:" + uuid.v4()
                    req.verification = id
                    verification.verification = auth.encrypt(id)
                    verification.email = req.email
                }
                req.verified = false
                await emailer.sendChangeEmailMessage(locale, verification)
            }
        }
        res.status(200).json(await updateProfileInDB(req, id))
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.changePassword = async (req, res) => {
    try {
        const id = await utils.isIDGood(req.user._id)
        const user = await findUser(id)
        req = matchedData(req)
        const isPasswordMatch = await auth.checkPassword(req.oldPassword, user)
        if (!isPasswordMatch) {
            utils.handleError(res, await passwordsDoNotMatch())
        } else {
            // all ok, proceed to change password
            res.status(200).json(await changePasswordInDB(id, req))
        }
    } catch (error) {
        utils.handleError(res, error)
    }
}

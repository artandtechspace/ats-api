const jwt = require('jsonwebtoken')
const User = require('../models/user')
const UserAccess = require('../models/userAccess')
const ForgotPassword = require('../models/forgotPassword')
const utils = require('../middleware/utils')
const uuid = require('uuid')
const {addHours} = require('date-fns')
const {matchedData} = require('express-validator')
const auth = require('../middleware/auth')
const emailer = require('../middleware/emailer')
const HOURS_TO_BLOCK = 2
const LOGIN_ATTEMPTS = 5

/*********************
 * Private functions *
 *********************/

/**
 * Generates a token
 * @param {Object} user - user object
 * @param {Object} userAccessId - userAccess object
 */
const generateToken = (user, userAccessId) => {
    // Gets expiration time
    const expiration = Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES
    // returns signed and encrypted token
    return jwt.sign(
        {
            data: {
                _id: user,
                _aid: userAccessId
            },
            exp: expiration
        },
        process.env.JWT_SECRET,
        {
            algorithm: 'HS512',
        }
    )
}

/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = req => {
    let user = {
        _id: req._id,
        firstname: req.firstname,
        lastname: req.lastname,
        email: req.email,
        role: req.role,
        verified: req.verified
    }
    // Adds verification for testing purposes
    if (process.env.NODE_ENV !== 'production') {
        user = {
            ...user,
            verification: req.verification
        }
    }
    return user
}

/**
 * Saves a new user access.js and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = async (req, user) => {
    return new Promise((resolve, reject) => {
        const userAccess = new UserAccess({
            email: user.email,
            ip: utils.getIP(req),
            userid: user._id,
            userNameCache: utils.getFullName(user),
            browser: utils.getBrowserInfo(req),
            country: utils.getCountry(req)
        })
        userAccess.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            const userInfo = setUserInfo(user)
            if (process.env.NODE_ENV !== 'production') {
                userInfo.verification = item.verification
            }
            // Returns data with access.js token
            resolve({
                keyToken: generateToken(user._id, item._id),
                accessToken: generateToken(user._id, item._id),
                user: userInfo
            })
        })
    })
}

/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async user => {
    return new Promise((resolve, reject) => {
        user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
        user.save((err, result) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            if (result) {
                resolve(utils.buildErrObject(409, 'BLOCKED_USER'))
            }
        })
    })
}

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async user => {
    return new Promise((resolve, reject) => {
        user.save((err, result) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            if (result) {
                resolve(true)
            }
        })
    })
}

/**
 * Checks that login attempts are greater than specified in constant and also that blockexpires is less than now
 * @param {Object} user - user object
 */
const blockIsExpired = user =>
    user.loginAttempts > LOGIN_ATTEMPTS && user.blockExpires <= new Date()

/**
 *
 * @param {Object} user - user object.
 */
const checkLoginAttemptsAndBlockExpires = async user => {
    return new Promise((resolve, reject) => {
        // Let user try to login again after blockexpires, resets user loginAttempts
        if (blockIsExpired(user)) {
            user.loginAttempts = 0
            user.save((err, result) => {
                if (err) {
                    reject(utils.buildErrObject(422, err.message))
                }
                if (result) {
                    resolve(true)
                }
            })
        } else {
            // User is not blocked, check password (normal behaviour)
            resolve(true)
        }
    })
}

/**
 * Checks if blockExpires from user is greater than now
 * @param {Object} user - user object
 */
const userIsBlocked = async user => {
    return new Promise((resolve, reject) => {
        console.log(user)
        if (user.blockExpires > new Date()) {
            reject(utils.buildErrObject(409, 'BLOCKED_USER'))
        }
        resolve(true)
    })
}

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUser = async email => {
    return new Promise((resolve, reject) => {
        User.findOne(
            {
                email
            },
            'password loginAttempts blockExpires name email role verified verification',
            (err, item) => {
                utils.itemNotFound(err, item, 'USER_DOES_NOT_EXIST')
                resolve(item)
            }
        )
    })
}

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserById = async userId => {
    return new Promise((resolve, reject) => {
        User.findById(userId, (err, item) => {
            utils.itemNotFound(err, item, 'USER_DOES_NOT_EXIST')
            resolve(item)
        })
    })
}

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS, if is less returns wrong password, else returns blockUser function
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async user => {
    user.loginAttempts += 1
    await saveLoginAttemptsToDB(user)
    return new Promise((resolve, reject) => {
        if (user.loginAttempts <= LOGIN_ATTEMPTS) {
            resolve(utils.buildErrObject(409, 'WRONG_PASSWORD'))
        } else {
            resolve(blockUser(user))
        }
        reject(utils.buildErrObject(422, 'ERROR'))
    })
}

/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = async req => {
    return new Promise((resolve, reject) => {

        const user = new User({
            email: req.email,
            verification: uuid.v4()
        })
        user.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            resolve(item)
        })
    })
}

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
const returnRegisterToken = (item, userInfo) => {
    if (process.env.NODE_ENV !== 'production') {
        userInfo.verification = item.verification
    }
    const data = {
        token: generateToken(item._id, userInfo._id),
        user: userInfo
    }
    return data
}

/**
 * Checks if verification id exists for user
 * @param {string} id - verification id
 */
const verificationExists = async id => {
    return new Promise((resolve, reject) => {
        User.findOne({
                verified: false,
                verification: id
            },
            (err, user) => {
                utils.itemNotFound(err, user, 'NOT_FOUND_OR_ALREADY_VERIFIED')
                resolve(user)
            }
        )
    })
}

const isVerificationIdGood = async id => {
    return new Promise((resolve, reject) => {
        id = auth.decrypt(id)
        if (id.split(":")[0] === "v" || id.split(":")[0] === "vEC") {
            resolve(id)
        } else utils.itemNotFound(null, null, 'ID_MALFORMED')
    })
}

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const verifyUser = async user => {
    return new Promise((resolve, reject) => {
        user.verified = true
        user.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            resolve({
                email: item.email,
                verified: item.verified
            })
        })
    })
}

/**
 * Marks a request to reset password as used
 * @param {Object} req - request object
 * @param {Object} forgot - forgot object
 */
const markResetPasswordAsUsed = async (req, forgot) => {
    return new Promise((resolve, reject) => {
        forgot.used = true
        forgot.ipChanged = utils.getIP(req)
        forgot.browserChanged = utils.getBrowserInfo(req)
        forgot.countryChanged = utils.getCountry(req)
        forgot.save((err, item) => {
            utils.itemNotFound(err, item, 'NOT_FOUND')
            resolve(utils.buildSuccObject('PASSWORD_CHANGED'))
        })
    })
}

/**
 * Updates a user password in database
 * @param {string} password - new password
 * @param {Object} user - user object
 */
const updatePassword = async (password, user) => {
    return new Promise((resolve, reject) => {
        user.password = password
        user.save((err, item) => {
            utils.itemNotFound(err, item, 'NOT_FOUND')
            resolve(item)
        })
    })
}


/**
 * Finds user by email to reset password
 * @param {string} email - user email
 */
const findUserToResetPassword = async email => {
    return new Promise((resolve, reject) => {
        User.findOne(
            {
                email
            },
            (err, user) => {
                utils.itemNotFound(err, user, 'NOT_FOUND')
                resolve(user)
            }
        )
    })
}

/**
 * Checks if a forgot password verification exists
 * @param {string} id - verification id
 */
const findForgotPassword = async id => {
    return new Promise((resolve, reject) => {
        ForgotPassword.findOne(
            {
                verification: id,
                used: false
            },
            (err, item) => {
                utils.itemNotFound(err, item, 'NOT_FOUND_OR_ALREADY_USED')
                resolve(item)
            }
        )
    })
}

/**
 * Creates a new password forgot
 * @param {Object} req - request object
 */
const saveForgotPassword = async req => {
    return new Promise((resolve, reject) => {
        const forgot = new ForgotPassword({
            email: req.body.email,
            verification: uuid.v4(),
            ipRequest: utils.getIP(req),
            browserRequest: utils.getBrowserInfo(req),
            countryRequest: utils.getCountry(req)
        })
        forgot.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            resolve(item)
        })
    })
}

/**
 * Builds an object with created forgot password object, if env is development or testing exposes the verification
 * @param {Object} item - created forgot password object
 */
const forgotPasswordResponse = item => {
    let data = {
        msg: 'RESET_EMAIL_SENT',
        email: item.email
    }
    if (process.env.NODE_ENV !== 'production') {
        data = {
            ...data,
            verification: item.verification
        }
    }
    return data
}

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param req
 * @param {*} next - next callback
 */
const checkPermissions = async (data, req, next) => {
    return new Promise((resolve, reject) => {
        User.findById(data.id, (err, result) => {
            utils.itemNotFound(err, result, 'NOT_FOUND')
            if (data.roles.indexOf(result.role) > -1) {
                return resolve(next())
            }
            return reject(utils.buildErrObject(401, 'UNAUTHORIZED'))
        })
    })
}

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = async token => {
    return new Promise((resolve, reject) => {
        // Decrypts, verifies and decode token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(utils.buildErrObject(409, 'BAD_TOKEN'))
            }
            resolve(decoded.data._id)
        })
    })
}

/********************
 * Public functions *
 ********************/

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.login = async (req, res) => {
    try {
        const data = matchedData(req)
        const user = await findUser(data.email)
        await userIsBlocked(user)
        await checkLoginAttemptsAndBlockExpires(user)
        const isPasswordMatch = await auth.checkPassword(data.password, user)
        if (!isPasswordMatch) {
            utils.handleError(res, await passwordsDoNotMatch(user))
        } else {
            // all ok, register access.js and return vtoken
            user.loginAttempts = 0
            await saveLoginAttemptsToDB(user)
            res.status(200).json(await saveUserAccessAndReturnToken(req, user))
        }
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.register = async (req, res) => {
    try {
        // Gets locale from header 'Accept-Language'
        const header = {
            headers: req.headers,
            connection: req.connection
        }
        const locale = req.getLocale()
        req = matchedData(req)
        const doesEmailExists = await emailer.emailExists(req.email)
        if (!doesEmailExists) {
            const item = await registerUser(req)
            const response = await saveUserAccessAndReturnToken(header, item)
            await emailer.sendRegistrationEmailMessage(locale, item)
            res.status(201).json(response)
        }
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verify = async (req, res) => {
    try {
        req = matchedData(req)
        const id = await isVerificationIdGood(req.id)
        const user = await verificationExists(id)
        user.email = user.changeEmail
        user.changeEmail = undefined
        if (id.split(":")[0] === "vEC") user.verifiedCEmail = true
        res.status(200).json(await verifyUser(user))
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Forgot password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.forgotPassword = async (req, res) => {
    try {
        // Gets locale from header 'Accept-Language'
        const locale = req.getLocale()
        const data = matchedData(req)
        await findUser(data.email)
        const item = await saveForgotPassword(req)
        await emailer.sendResetPasswordEmailMessage(locale, item)
        res.status(200).json(forgotPasswordResponse(item))
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.resetPassword = async (req, res) => {
    try {
        const data = matchedData(req)
        const forgotPassword = await findForgotPassword(data.id)
        const user = await findUserToResetPassword(forgotPassword.email)
        await updatePassword(data.password, user)
        const result = await markResetPasswordAsUsed(req, forgotPassword)
        res.status(200).json(result)
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getRefreshToken = async (req, res) => {
    try {
        const tokenEncrypted = req.headers.authorization
            .replace('Bearer ', '')
            .trim()
        let userId = await getUserIdFromToken(tokenEncrypted)
        userId = await utils.isIDGood(userId)
        const user = await findUserById(userId)
        const token = await saveUserAccessAndReturnToken(req, user)
        // Removes user info from response
        delete token.user
        res.status(200).json(token)
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Roles authorization function called by route
 * @param {Array} roles - roles specified on the route
 */
exports.roleAuthorization = roles => async (req, res, next) => {
    try {
        const data = {
            id: req.user._id,
            roles
        }
        await checkPermissions(data, req, next)
    } catch (error) {
        utils.handleError(res, error)
    }
}

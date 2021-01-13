const jwt = require('jsonwebtoken')
const userModel = require('../models/user')
const permModel = require('../models/permission')
const utils = require('../middleware/utils')
const permissioner = require('../middleware/permissioner')
const {matchedData} = require('express-validator')
const auth = require('../middleware/auth')
const db = require('../middleware/db')


/**
 * Creates a new item in database
 * @param user
 * @param {Object} req - request object
 */
const createItem = async (user, req) => {
    return new Promise((resolve, reject) => {
        user.permissions.push({
            permissionId: req.body.permission,
            addedAdminId: req.user._id
        })
        user.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            // Removes properties with rest operator
            const removeProperties = ({
                                          // eslint-disable-next-line no-unused-vars
                                          password,
                                          // eslint-disable-next-line no-unused-vars
                                          blockExpires,
                                          // eslint-disable-next-line no-unused-vars
                                          loginAttempts,
                                          ...rest
                                      }) => rest
            resolve(item)
        })
    })
}

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserById = async userId => {
    return new Promise((resolve, reject) => {
        userModel.findById(userId, (err, item) => {
            utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
            resolve(item)
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
        jwt.verify(auth.decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(utils.buildErrObject(409, 'BAD_TOKEN'))
            }
            resolve(decoded.data._id)
        })
    })
}

/**
 * Checks if blockExpires from user is greater than now
 * @param {Object} user - user object
 */
const userIsBlocked = async user => {
    return new Promise((resolve, reject) => {
        if (user.blockExpires > new Date()) {
            reject(utils.buildErrObject(409, 'BLOCKED_USER'))
        }
        resolve(true)
    })
}

exports.getItems = async (req, res) => {
    try {
        const data = matchedData(req)
        const user = await findUserById(data.id)
        await userIsBlocked(user)
        const _data = {
            permission: user.permission
        }
        res.status(200).json(_data)
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
    try {
        console.log("lol", req)
        req = matchedData(req)
        console.log(req)
        const id = await utils.isIDGood(req.id)
        let data = await db.getItem(id, userModel)
        data = {
            permission: data.permission
        }
        res.status(200).json(data)
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
    try {
        const id = await utils.isIDGood(req.body.id)
        let user = await db.getItem(id, userModel)
        await permissioner.permissionIsIdGood(req.body.permission)
        console.log(await permissioner.permissionIsAssigned(user, req.body.permission))
        const item = await createItem(user, req)
        res.status(201).json(item)
    } catch (error) {
        utils.handleError(res, error)
    }
}
const userModel = require('../models/user')
const utils = require('../middleware/utils')
const permissioner = require('../middleware/permissioner')
const permissionModel = require('../models/permission')
const {matchedData} = require('express-validator')
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
            resolve(removeProperties(item.toObject()))
        })
    })
}

/**
 * Creates a new item in database
 * @param user
 * @param {Object} req - request object
 */
const createRevokeItem = async (user, req) => {
    return new Promise((resolve, reject) => {
        user.permissionsRevoke.push({
            permissionIdLink: req.body.permissionIdLink,
            addedAdminId: req.user._id,
            revokeMessage: req.body.revokemessage
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
            resolve(removeProperties(item.toObject()))
        })
    })
}


/**
 * Creates a new item in database
 * @param user
 * @param id
 */
const pardonRevokeItem = async (user, id) => {
    return new Promise((resolve, reject) => {
        const item = user.permissionsRevoke.filter(buffer => buffer.permissionIdLink === id);
        if (item) {
            item.forEach(revoke => {
                if (revoke.revokeIsActive) {
                    revoke.revokeIsActive = false
                    revoke.revokeMessage = "awdawdawd"
                }
            })
        }
        console.log(item)
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
            resolve(removeProperties(item.toObject()))
        })
    })
}

const revokeItemUpdate = async (user, req) => {
    return new Promise((resolve, reject) => {
        let item = user.permissionsRevoke.find(buffer => JSON.parse(JSON.stringify(buffer._id)) === req.body.revokeid)
        item.revokeMessage = req.body.revokemessage
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
            resolve(removeProperties(item.toObject()))
        })
    })
}

/**
 * Finds user by ID
 * @param userId
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
 * Finds user by ID
 * @param permissionID
 */
const findPermissionById = async permissionID => {
    return new Promise((resolve, reject) => {
        permissionModel.findById(permissionID, (err, item) => {
            resolve(item)
        })
    })
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
    try {
        const data = matchedData(req)
        const user = await findUserById(data.id)
        const _data = {
            permission: user.permission
        }
        res.status(200).json(_data)
    } catch (error) {
        utils.handleError(res, error)
    }
}


/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getUserItems = async (req, res) => {
    try {
        let user = await findUserById(req.user._id)
        const data = {permissions:[]}
        for (let permission of user.permissions) {
            if (permission.permissionId) {
                permission = JSON.parse(JSON.stringify(permission))
                const item = await findPermissionById(permission.permissionId)
                permission.revoke = []
                user.permissionsRevoke.forEach(revoke => {
                    if (revoke.permissionIdLink === permission._id) permission.revoke.push(revoke)
                })
                permission.permission = item.permission
                permission.permissionName = item.permissionName
                permission.type = item.type
                permission.description = item.description
                permission.supervised = item.supervised
                permission.supervisedAdmin = item.supervisedAdmin
                console.log(permission)
                data.permissions.push(permission)
            }
        }
        res.status(200).json(JSON.parse(JSON.stringify(data)))
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
        req = matchedData(req)
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
        const id = await utils.isIDGood(req.params.id)
        let user = await db.getItem(id, userModel)
        await permissioner.permissionIsIdGood(req.body.permission)
        await permissioner.permissionIsAlreadyAssigned(user, req.body.permission, 'PERMISSION_ALREADY_ASSIGNED')
        const item = await createItem(user, req)
        res.status(201).json(item)
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.revokeItem = async (req, res) => {
    try {
        const id = await utils.isIDGood(req.params.id)
        let user = await db.getItem(id, userModel)
        await permissioner.permissionIdIsLinkAssigned(user, req.body.permissionIdLink)
        await permissioner.permissionIsRevokedActive(user, req.body.permissionIdLink, 'PERMISSION_IS_REVOKED', true)
        const item = await createRevokeItem(user, req)
        res.status(201).json(item)
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.pardonRevokeItem = async (req, res) => {
    try {
        const id = await utils.isIDGood(req.params.id)
        let user = await db.getItem(id, userModel)
        await permissioner.permissionIdIsLinkAssigned(user, req.body.permissionIdLink)
        await permissioner.permissionIsRevokedActive(user, req.body.permissionIdLink, 'PERMISSION_REVOKE_IS_NOT_ASSIGNED')
        const item = await pardonRevokeItem(user, req.body.permissionIdLink)
        res.status(201).json(item)
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.revokeItemUpdate = async (req, res) => {
    try {
        const id = await utils.isIDGood(req.params.id)
        let user = await db.getItem(id, userModel)
        await permissioner.permissionRevokeExists(user, req.body.revokeid)
        const item = await revokeItemUpdate(user, req)
        res.status(201).json(item)
    } catch (error) {
        utils.handleError(res, error)
    }
}
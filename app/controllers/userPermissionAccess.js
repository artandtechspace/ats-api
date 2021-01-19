const jwt = require('jsonwebtoken')
const userModel = require('../models/user')
const permModel = require('../models/permission')
const userPermissionsAccessModel = require('../models/userPermissionAccess')
const utils = require('../middleware/utils')
const permissioner = require('../middleware/permissioner')
const {matchedData} = require('express-validator')
const auth = require('../middleware/auth')
const db = require('../middleware/db')

/**
 * Add a new Permission Access to database
 * @param user
 * @param {Object} req - request object
 */
const createAccessItem = async req => {
    return new Promise((resolve, reject) => {
        const userPermissionsAccess = new userPermissionsAccessModel({
            userid: req.id,
            userNameCache: req.userNameCache,
            permissionId: req.permissionId,
            permissionNameCache: req.permissionNameCache
        })
        userPermissionsAccess.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            resolve(item)
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

exports.createItem = async (req, res) => {
    try {
        const data = matchedData(req)
        const user = findUserById(data.id)
        if (data.permmissionId) data.permmissionLink = await permissioner.permissionIsAssigned(user, data.permmissionId)
        else if (data.permmission) {
            data.permmissionId = await permissioner.permissionGetId(data.permmission)
            data.permmissionLink = await permissioner.permissionIsAssigned(user, data.permmissionId)
        }
        await permissioner.permissionIsRevokedActive(user, data.permmission, 'PERMISSION_REVOKE_IS_NOT_ASSIGNED', true)
        //unlock Machine
        const resolve = await createItem(data)
        res.status(201).json(resolve)
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.closeItem = async (req, res) => {
    try {
        const data= {status:"error function not ready"}
        res.status(201).json(data)
    } catch (error) {
        utils.handleError(res, error)
    }
}
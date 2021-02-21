const userPermissionsAccessModel = require('../models/userPermissionAccess')
const utils = require('../middleware/utils')
const permissioner = require('../middleware/permissioner')
const machiner = require('../middleware/machiner')
const {matchedData} = require('express-validator')
const db = require('../middleware/db')

/**
 * Add a new Permission Access to database
 * @param user
 * @param {Object} req - request object
 */
const createAccessItem = async req => {
    return new Promise((resolve, reject) => {
        const userPermissionsAccess = new userPermissionsAccessModel({
            userid: req.userid,
            userNameCache: req.userNameCache,
            permissionId: req.perm._id,
            permissionNameCache: req.perm.permissionName
        })
        userPermissionsAccess.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            resolve(item)
        })
    })
}

const closeAccessItem = async id => {
    return new Promise((resolve, reject) => {
        userPermissionsAccessModel.findByIdAndUpdate(id, {end: true},
            {
                new: true
            },
            (err, item) => {
                if (err) {
                    reject(utils.buildErrObject(422, err.message))
                }
                resolve(item)
            })
    })
}

exports.createItem = async (req, res) => {
    try {
        const user = req.user
        const data = matchedData(req);
        if (data.permissionId !== undefined) data.perm = await permissioner.permissionGetById(data.permissionId)
        if (data.permission !== undefined) data.perm = await permissioner.permissionGetByName(data.permission)
        data.userid = user._id
        data.userNameCache = utils.getFullName(user)
        const assignedPermission = await permissioner.permissionIsAssigned(user, data.perm._id, 'PERMISSION_IS_NOT_ASSIGNED')
        await permissioner.permissionIsRevokedActive(user, assignedPermission._id, 'PERMISSION_REVOKE_IS_ASSIGNED', true)
        await machiner.isMachineActiveByPermId(data.permissionId, 'MACHINE_ALREADY_IN_USE')
        const act = {ipaddress: data.perm.ipaddress, userId: user._id, userName: user.name}
        if (process.env.NODE_ENV === 'production') await machiner.activateMachine(act)
        else console.log("activate:", act)
        const resolve = await createAccessItem(data)
        res.status(201).json(resolve)
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.closeItem = async (req, res) => {
    try {
        const user = req.user
        const data = matchedData(req);
        if (data.permissionId !== undefined) data.perm = await permissioner.permissionGetById(data.permissionId)
        if (data.permission !== undefined) data.perm = await permissioner.permissionGetByName(data.permission)
        const assignedPermission = await permissioner.permissionIsAssigned(user, data.perm._id, 'PERMISSION_IS_NOT_ASSIGNED')
        await permissioner.permissionIsRevokedActive(user, assignedPermission._id, 'PERMISSION_REVOKE_IS_ASSIGNED', true)
        const userPermAccess =  JSON.parse(JSON.stringify(await machiner.isMachineActiveByPermId(data.permissionId, "MACHINE_NOT_IN_USE", true)))
        const act = {ipaddress: data.perm.ipaddress, userId: user._id, userName: user.name}
        if (process.env.NODE_ENV === 'production') await machiner.deactivateMachine(act)
        else console.log("deactivate:", act)
        const resolve = await closeAccessItem(userPermAccess[0]._id)
        res.status(201).json(resolve)
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.getItems = async (req, res) => {
    try {
        const query = await db.checkQueryString(req.query)
        res.status(200).json(await db.getItems(req, userPermissionsAccessModel, query))
    } catch (error) {
        utils.handleError(res, error)
    }
}
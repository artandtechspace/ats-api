const permModel = require('../models/permission')
const {itemAlreadyExists, itemNotFound} = require('../middleware/utils')

module.exports = {

    /**
     * Checks if permission name exists
     * @param permission
     */
    async permissionExists(permission) {
        return new Promise((resolve, reject) => {
            permModel.findOne({permission}, (err, item) => {
                    itemAlreadyExists(err, item, reject, 'PERMISSION_ALREADY_EXISTS')
                    resolve(false)
                }
            )
        })
    },

    /**
     * Checks if permission id exists
     * @param id
     */
    async permissionIsIdGood(id) {
        return new Promise((resolve, reject) => {
            permModel.findById(id, (err, item) => {
                    itemNotFound(err, item, reject, 'PERMISSION_DOES_NOT_EXISTS')
                    resolve(true)
                }
            )
        })
    },

    /**
     * Checks if _id exists in user document under permissions
     * @param user
     * @param id
     */
    async permissionIdIsLinkAssigned(user, id) {
        return new Promise((resolve, reject) => {
            user = JSON.parse(JSON.stringify(user))
            const item = user.permissions.find(buffer => buffer._id === id);
            itemNotFound(null, item, reject, 'PERMISSION_LINK_IS_NOT_ASSIGNED')
            resolve(true)
        })
    },

    /**
     * Checks if permission id exists in user document
     * @param {Object} user - user as model
     * @param {string} id - permissionId
     * @param {string} message - error json message
     * @return {Object} permission
     */
    async permissionIsAssigned(user, id, message) {
        return new Promise((resolve, reject) => {
            let item = user.permissions.find(buffer => buffer.permissionId === id.toString());
            if (item === undefined) {
                item = null
            }
            itemNotFound(null, item, reject, message)
            resolve(item)
        })
    },


    /**
     * Checks if permission id exists in user document
     * @param {Object} user - user as model
     * @param {string} id - permissionId
     * @param {string} message - error json message
     * @return {Object} permission
     */
    async permissionIsAlreadyAssigned(user, id, message) {
        return new Promise((resolve, reject) => {
            let item = user.permissions.find(buffer => buffer.permissionId === id.toString());
            if (item === undefined) {
                item = null
            }
            itemAlreadyExists(null, item, reject, message)
            resolve(true)
        })
    },

    /**
     * Checks if permission revoke exists
     * @param user
     * @param id
     */
    async permissionRevokeExists(user, id) {
        return new Promise((resolve, reject) => {
            user = JSON.parse(JSON.stringify(user))
            const item = user.permissionsRevoke.find(buffer => buffer._id === id);
            itemNotFound(null, item, reject, 'PERMISSION_REVOKE_DOES_NOT_EXISTS')
            resolve(true)
        })
    },

    async permissionIsRevokedActive(user, permission, message, invert = false) {
        return new Promise((resolve, reject) => {
            const item = user.permissionsRevoke.filter(buffer => buffer.permissionIdLink === permission);
            if (item) {
                item.forEach(revoke => {
                    if (revoke.revokeIsActive) {
                        if (invert) itemAlreadyExists(null, item, reject, message)
                        else resolve(revoke)
                    }
                })
            }
            if (invert) resolve(true)
            else itemAlreadyExists(null, item, reject, message)
        })
    },

    async permissionGetById(id) {
        return new Promise((resolve, reject) => {
            permModel.findOne({_id: id}, (err, item) => {
                itemNotFound(err, item, reject, 'PERMISSION_DOES_NOT_EXISTS')
                resolve(item)
            })
        })
    },

    async permissionGetByName(permission) {
        return new Promise((resolve, reject) => {
            permModel.findOne({permission: permission}, (err, item) => {
                itemNotFound(err, item, reject, 'PERMISSION_DOES_NOT_EXISTS')
                resolve(item)
            })
        })
    }
}
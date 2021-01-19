const permModel = require('../models/permission')
const {itemAlreadyExists, itemNotFound} = require('../middleware/utils')

module.exports = {

    /**
     * Checks if permission name exists
     * @param permission
     */
    async permissionExists(permission) {
        return new Promise((resolve, reject) => {
            permModel.findOne(
                {
                    permission
                },
                (err, item) => {
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
            permModel.findById(id,
                (err, item) => {
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
     */
    async permissionIsAssigned(user, id) {
        return new Promise((resolve, reject) => {
            const item = user.permissions.find(buffer => buffer.permissionId === id);
            itemAlreadyExists(null, item, reject, 'PERMISSION_ALREADY_ASSIGNED')
            resolve(item)
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
            const item = user.permissionsRevoke.filter(buffer => buffer.permissionIdLink === id);
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

    async permissionGetId(permission) {
        return new Promise((resolve, reject) => {
            permModel.findOne({permission: permission}, (err, item) => {
                itemNotFound(err, item, reject, 'PERMISSION_DOES_NOT_EXISTS')
                resolve(item.permissionId)
            })
        })
    }
}
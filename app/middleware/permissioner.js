const permModel = require('../models/permission')
const {itemAlreadyExists, itemNotFound} = require('../middleware/utils')
const mongoose = require('mongoose')

module.exports = {
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

    async permissionIdIsLinkAssigned(user, id) {
        return new Promise((resolve, reject) => {
            user = JSON.parse(JSON.stringify(user))
            const item = user.permissions.find(buffer => buffer._id === id);
            itemNotFound(null, item, reject, 'PERMISSION_LINK_IS_NOT_ASSIGNED')
            resolve(true)
        })
    },

    async permissionIsAssigned(user, id) {
        return new Promise((resolve, reject) => {
            const item = user.permissions.find(buffer => buffer.permissionId === id);
            itemAlreadyExists(null, item, reject, 'PERMISSION_ALREADY_ASSIGNED')
            resolve(true)
        })
    },

    async permissionIsRevokeActive(user, id) {
        return new Promise((resolve, reject) => {
            const item = user.permissionsRevoke.filter(buffer => buffer.permissionIdLink === id);
            if (item) {
                item.forEach(revoke => {
                    if (revoke.revokeIsActive) {
                        itemAlreadyExists(null, item, reject, 'PERMISSION_REVOKE_ALREADY_ASSIGNED')
                    }
                })
            }
            resolve(true)
        })
    }
}
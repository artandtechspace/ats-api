const permModel = require('../models/permission')
const userModel = require('../models/user')
const {itemAlreadyExists, itemNotFound} = require('../middleware/utils')
const db = require('../middleware/db')

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

    async permissionIsAssigned(user, id) {
        return new Promise((resolve, reject) => {
            const item = user.permissions.find(buffer=>buffer.permissionId === id);
            itemAlreadyExists(null, item, reject, 'PERMISSION_ALREADY_ASSIGNED')
            resolve(true)
        })
    }
}
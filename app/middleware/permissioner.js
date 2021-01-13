const User = require('../models/permission')
const {itemAlreadyExists} = require('../middleware/utils')

module.exports = {
    async permissionExists(permission) {
        return new Promise((resolve, reject) => {
            User.findOne(
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
}
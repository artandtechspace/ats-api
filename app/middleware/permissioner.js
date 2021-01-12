const User = require('../models/permission')
const {itemAlreadyExists} = require('../middleware/utils')


module.exports = {
    async permissionExists(id, permission) {
        return new Promise((resolve, reject) => {
            User.findOne(
                {
                    permission,
                    _id: {
                        $ne: id
                    }
                },
                (err, item) => {
                    itemAlreadyExists(err, item, reject, 'PERMISSION_ALREADY_EXISTS')
                    resolve(false)
                }
            )
        })
    },
}
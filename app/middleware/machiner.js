const userPermAccessModel = require('../models/userPermissionAccess')
const {itemAlreadyExists, itemNotFound} = require('../middleware/utils')

module.exports = {

    async isMachineActive(Id) {
        return new Promise((resolve, reject) => {
            userPermAccessModel.find({permissionId: Id.toString()})
                .where('end')
                .equals('false')
                .exec((err, item) => {
                    if (item.length > 0) itemAlreadyExists(err, item, reject, 'MACHINE_ALREADY_IN_USE')
                    resolve()
                })
        })
    },

    async activateMachine(Id){
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
}
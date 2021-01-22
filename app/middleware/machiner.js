const userPermAccessModel = require('../models/userPermissionAccess')
const utils = require('../middleware/utils')
const {itemAlreadyExists, itemNotFound} = require('../middleware/utils')
const axios = require('axios')

module.exports = {

    async isMachineActiveByPermId(Id) {
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

    async isMachineActiveByAccessId(Id) {
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

    async activateMachine(data) {
        return new Promise((resolve, reject) => {
            axios.post(data.ip + "/activate", data)
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (error) {
                    reject(utils.buildErrObject(422, error))
                });
        })
    },

    async deactivateMachine(data) {
        return new Promise((resolve, reject) => {
            axios.post(data.ip + "/deactivate", data)
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (error) {
                    reject(utils.buildErrObject(422, error))
                });
        })
    },
}
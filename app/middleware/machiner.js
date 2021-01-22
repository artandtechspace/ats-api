const userPermAccessModel = require('../models/userPermissionAccess')
const utils = require('../middleware/utils')
const {itemAlreadyExists, itemNotFound} = require('../middleware/utils')
const axios = require('axios')

module.exports = {

    async isMachineActiveByPermId(permId, message, invert = false) {
        return new Promise((resolve, reject) => {
            userPermAccessModel.find({permissionId: permId.toString()})
                .where('end')
                .equals('false')
                .exec((err, item) => {
                    if (invert && item.length > 0) resolve(item)
                    if (invert || item.length > 0) itemAlreadyExists(err, item, reject, message)
                    resolve(item)
                })
        })
    },

    async isMachineActiveByAccessId(accessId, message, invert = false) {
        return new Promise((resolve, reject) => {
            userPermAccessModel.find({_id: accessId.toString()})
                .where('end')
                .equals('false')
                .exec((err, item) => {
                    if (invert && item.length > 0) resolve(item)
                    if (invert || item.length > 0) itemAlreadyExists(err, item, reject, message)
                    resolve(item)
                })
        })
    },

    async activateMachine(data) {
        return new Promise((resolve, reject) => {
            axios.post(data.ipaddress + "/activate", data)
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
            axios.post(data.ipaddress + "/deactivate", data)
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (error) {
                    reject(utils.buildErrObject(422, error))
                });
        })
    },
}
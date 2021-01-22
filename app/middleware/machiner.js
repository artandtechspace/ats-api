const userPermAccessModel = require('../models/userPermissionAccess')
const utils = require('../middleware/utils')
const {itemAlreadyExists, itemNotFound} = require('../middleware/utils')
const axios = require('axios')

module.exports = {

    /**
     * Check if Machine is active ore not by permission._id
     * @param {string} permId permissionId - from model permission
     * @param {string} message - error json message
     * @param {boolean} invert - inverting return
     */
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

    /**
     * Check if Machine is active ore not by userPermissionsAccess._id
     * @param {string} accessId - from model userPermissionsAccess
     * @param {string} message - error json message
     * @param {boolean} invert - inverting return
     */
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

    /**
     * Send api call to activate a machine
     * @param {Object} data
     * @param {string} data.ipaddress - URL for api call
     * @param {string} data.userId - machine cache
     * @param {string} data.userName - machine display
     */
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

    /**
     * Send api call to deactivate a machine
     * @param {Object} data
     * @param {string} data.ipaddress - URL for api call
     * @param {string} data.userId - machine cache
     * @param {string} data.userName - machine display
     */
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
const braintree = require("braintree")
const gateway = require("../../config/gateway")
const utils = require('../middleware/utils')
const userModel = require('../models/user')

module.exports = {

    async customerFind(customerId) {
        return new Promise((resolve, reject) => {
            gateway.customer.find(customerId)
                .then(response => {
                    resolve(response)
                })
                .catch(err => {
                    reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
                })
        })
    },

    async createCustomer(firstName, lastName, email) {
        return new Promise(((resolve, reject) => {
            gateway.customer.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
            })
                .then(result => {
                    if (!result.success) {
                        reject(utils.buildErrObject(500, result.message))
                    }
                    resolve(result.customer)
                })
        }))
    },

    async setCustomerId(userId, customerId) {
        return new Promise((resolve, reject) => {
            userModel.findByIdAndUpdate(
                {_id: userId},
                {customerId: customerId},
                {new: true},
                function (err, user) {
                    if (!user) {
                        reject(utils.buildErrObject(500, "CAN_NOT_SET_CUSTOMER_ID"))
                    }
                    resolve(user)
                }
            )
        })
    },

    async deleteCustomer(customerId) {
        return new Promise((resolve, reject) => {
            gateway.customer.delete(result.customer.id).catch(err => {
                reject(utils.buildErrObject(500, "Fatal error contact Admin"))
            })
            resolve(true)
        })
    }
}
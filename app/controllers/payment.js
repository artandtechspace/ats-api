const {Transaction} = require("braintree")
const gateway = require("../../config/gateway")
const userModel = require("../models/user")
const utils = require('../middleware/utils')
const payment = require('../middleware/payment')
const {matchedData} = require('express-validator')
const TRANSACTION_SUCCESS_STATUSES = [
    Transaction.Status.Authorizing,
    Transaction.Status.Authorized,
    Transaction.Status.Settled,
    Transaction.Status.Settling,
    Transaction.Status.SettlementConfirmed,
    Transaction.Status.SettlementPending,
    Transaction.Status.SubmittedForSettlement,
];

const createAddress = async (customerId, firstName, lastName, company = null, streetAddress, extendedAddress = null, locality, region, postalCode, countryCodeAlpha2) => {
    return new Promise((resolve, reject) => {
        if (company === "") company = null
        if (extendedAddress === "") extendedAddress = null
        gateway.address.create({
            customerId: customerId,
            firstName: firstName,
            lastName: lastName,
            company: company,
            streetAddress: streetAddress,
            extendedAddress: extendedAddress,
            locality: locality,
            region: region,
            postalCode: postalCode,
            countryCodeAlpha2: countryCodeAlpha2
        })
            .then(result => {
                userSetAddress(result.id) // aösoghaädsgj#aäpog
                if (!result.success) reject(utils.buildErrObject(402, "CAN_NOT_FIND_ADDRESS"))
                resolve(result.address)
            })
            .catch(err => {
                reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
            })
    })
}

const userSetAddress = async (userId, addressId) => {
    return new Promise((resolve, reject) => {
        console.log("err")
        userModel.findByIdAndUpdate(
            {_id: userId},
            {addressId: addressId},
            {new: true},
            function (err, user) {
                if (!user) {
                    reject(utils.buildErrObject(500, "Fatal error contact Admin"))
                }
                resolve(user)
            }
        )
    })
}

const updateAddress = async (customerId, addressId, address) => {
    return new Promise((resolve, reject) => {
        console.log(address)
        gateway.address.update(customerId, addressId, address)
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
            })
    })
}

const removeAddress = async (customerId, addressId) => {
    return new Promise((resolve, reject) => {
        gateway.address.delete(customerId, addressId)
            .then(result => {
                resolve("success")
            })
            .catch(err => {
                reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
            })
    })
}

const getAddress = async (customerId, addressId) => {
    return new Promise((resolve, reject) => {
        gateway.address.find(customerId, addressId)
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                if (err.type === "notFoundError") reject(utils.buildErrObject(500, "ADDRESS_DO_NOT_EXITS"))
                reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
            })
    })
}

const getUserAddress = async (customerId, addressId) => {
    return new Promise((resolve, reject) => {
        if (addressId === "") reject(utils.buildErrObject(402, "ADDRESS_IS_NOT_SET_AT_USER"))
        gateway.address.find(customerId, addressId)
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
            })
    })
}

const createClientToken = async customerId => {
    return new Promise((resolve, reject) => {
        gateway.clientToken.generate({
            customerId: customerId
        })
            .then(response => {
                if (!response.success) reject(utils.buildErrObject(500, "CAN_NOT_CREATE_CLIENT_TOKEN"))
                resolve(response.clientToken)
            })
            .catch(err => {
                reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
            })
    })
}

const unsetUserAddressId = async (userId) => {
    return new Promise((resolve, reject) => {
        userModel.findByIdAndUpdate(
            userId,
            {addressId: undefined},
            {overwrite: true},
            function (err, user) {
                if (!user) {
                    reject(utils.buildErrObject(500, "FAILED_TO_UNSET_USER_ADDRESS_ID"))
                }
                resolve(user)
            })
    })
}

const getPlan = async => {
    return new Promise((resolve, reject) => {
        gateway.plan.all()
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
            })
    })
}

const getCustomer = async (user) => {
    if (typeof user.customerId !== 'undefined') {
        const customer = await payment.customerFind(user.customerId).catch((error) => console.log(error))
        if (customer) return customer
    }
    const customer = await payment.createCustomer(user.firstname, user.lastname, user.email)
    await payment.setCustomerId(user._id, customer.id)
        .catch(() => {
            payment.deleteCustomer(customer.id)
        })
    return customer
}

exports.createCheckout = async (req, res, next) => {
    try {
        const user = req.user
        const customer = await getCustomer(user)
        res.status(200).json(await createClientToken(customer.id))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.getCustomer = async (req, res, next) => {
    try {
        const user = req.user
        return res.status(200).json(await getCustomer(user))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.createAddress = async (req, res, next) => {
    try {
        const user = req.user
        const data = matchedData(req)
        const customer = await getCustomer(user)
        if (!data.body.company) data.body.company = ""
        if (!data.body.extendedAddress) data.body.extendedAddress = ""
        res.status(200).json(await createAddress(customer.id, data.body.firstName, data.body.lastName, data.body.company, data.body.streetAddress, data.body.extendedAddress, data.body.locality, data.body.region, data.body.postalCode, data.body.countryCodeAlpha2))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.updateAddress = async (req, res, next) => {
    try {
        const user = req.user
        const data = matchedData(req)
        const customer = await getCustomer(user)
        const address = await getAddress(customer.id, data.params.id)
        res.status(200).json(await updateAddress(customer.id, address.id, data.body))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.removeAddress = async (req, res, next) => {
    try {
        const user = req.user
        const data = matchedData(req)
        const customer = await getCustomer(user)
        const address = await getAddress(customer.id, data.params.id)
        if (data.params.id === user.addressId) await unsetUserAddressId(user._id, address.id)
        res.status(200).json(await removeAddress(customer.id, address.id))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.getAddress = async (req, res, next) => {
    try {
        const user = req.user
        const data = matchedData(req)
        const customer = await getCustomer(user)
        if (!user.addressId) user.addressId = ""
        res.status(200).json(await getUserAddress(customer.id, user.addressId))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.setAddress = async (req, res, next) => {
    try {
        const user = req.user
        const data = matchedData(req)
        const customer = await getCustomer(user)
        if (!data.params.id) data.params.id = ""
        const address = await getAddress(customer.id, data.params.id)
        res.status(201).json(await userSetAddress(user._id, address.id))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.getPlans = async (req, res, next) => {
    try {
        res.status(200).json(await getPlan())
    } catch (error) {
        utils.handleError(res, error)
    }
}
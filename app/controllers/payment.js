const {Transaction} = require("braintree")
const gateway = require("../../config/gateway")
const userModel = require("../models/user")
const utils = require('../middleware/utils')
const TRANSACTION_SUCCESS_STATUSES = [
    Transaction.Status.Authorizing,
    Transaction.Status.Authorized,
    Transaction.Status.Settled,
    Transaction.Status.Settling,
    Transaction.Status.SettlementConfirmed,
    Transaction.Status.SettlementPending,
    Transaction.Status.SubmittedForSettlement,
];

const createCustomer = async (req, firstname, lastname, email, company = null, phone = null) => {
    return new Promise((resolve, reject) => {
        if (typeof req.user.customerId !== 'undefined') {
            gateway.customer.find(req.user.customerId)
                .then(response => {
                    if (!response.success) {
                        utils.buildErrObject(500, "CAN_NOT_GET_CUSTOMER")
                    }
                    resolve(response)
                })
                .catch(err => {
                    reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
                })
        } else {
            gateway.customer.create({
                firstName: firstname,
                lastName: lastname,
                email: email,
                company: company,
                phone: phone
            })
                .then(result => {
                    if (result.success) {
                        userModel.findByIdAndUpdate(
                            {_id: req.user._id},
                            {customerId: result.customer.id},
                            {new: true},
                            function (err, user) {
                                if (!user) {
                                    gateway.customer.delete(result.customer.id).catch(err => {
                                        if (err) utils.buildErrObject(500, "Fatal error contact Admin")
                                        utils.buildErrObject(500, "ERROR_WITH_MONGODB")
                                    });
                                }
                                resolve(result.customer)
                            }
                        )
                    } else {
                        reject(utils.buildErrObject(500, message))
                    }
                })
                .catch(err => {
                    reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
                })
        }
    })
}

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
                setAddress(result.id)
                resolve(result)
            })
            .catch(err => {
                reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
            })
    })
}

const setAddress = async (userId, addressId) => {
    return new Promise((resolve, reject) => {
        userModel.findByIdAndUpdate(
            {_id: userId},
            {addressId: addressId},
            {new: true},
            function (err, user) {
                if (!user) {
                    reject(utils.buildErrObject(500, "Fatal error contact Admin"))
                }
                resolve(result.customer)
            }
        )
    })
}

const updateAddress = async (customerId, addressId, address) => {
    return new Promise((resolve, reject) => {
        gateway.address.create(customerId, addressId, address)
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
        gateway.address.create(customerId, addressId)
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(utils.buildErrObject(500, "INTERNAL_SERVER_ERROR " + err))
            })
    })
}

const getAddress = async (customerId, addressId) => {
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

exports.createCheckout = async (req, res, next) => {
    try {
        const customer = await createCustomer(req, req.user.firstname, req.user.lastname, email)
        res.status(200).json(await createClientToken(customer.id))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.getCustomer = async (req, res, next) => {
    try {
        res.status(200).json(await createCustomer(req, req.user.firstname, req.user.lastname, req.user.email))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.createAddress = async (req, res, next) => {
    try {
        const customer = await createCustomer(req, req.user.firstname, req.user.lastname, req.user.email)
        if (!req.body.company) req.body.company = ""
        if (!req.body.extendedAddress) req.body.extendedAddress = ""
        res.status(200).json(await createAddress(customer.id, req.body.firstName, req.body.lastName, req.body.company, req.body.streetAddress, req.body.extendedAddress, req.body.locality, req.body.region, req.body.postalCode, req.body.countryCodeAlpha2))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.updateAddress = async (req, res, next) => {
    try {
        const customer = await createCustomer(req, req.user.firstname, req.user.lastname, req.user.email)
        const address = await getAddress(customer.id, req.params.id)
        res.status(200).json(await updateAddress(customer.id, address.id, req.body))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.removeAddress = async (req, res, next) => {
    try {
        const customer = await createCustomer(req, req.user.firstname, req.user.lastname, req.user.email)
        res.status(200).json(await removeAddress(customer.id, req.body.addressId))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.getAddress = async (req, res, next) => {
    try {
        const customer = await createCustomer(req, req.user.firstname, req.user.lastname, req.user.email)
        if (!req.user.addressId) req.user.addressId = ""
        res.status(200).json(await getAddress(customer.id, req.user.addressId))
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.setAddress = async (req, res, next) => {
    try {
        const customer = await createCustomer(req, req.user.firstname, req.user.lastname, req.user.email)
        if (!req.user.addressId) req.user.addressId = ""
        const address = await getAddress(customer.id, req.user.addressId)
        res.status(200).json(await setAddress(req.user._id, address.id))
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
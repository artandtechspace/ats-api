const controller = require('../controllers/payment')
const validate = require('../controllers/payment.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
    session: false
})
const trimRequest = require('trim-request')

/*
 * Permissions routes
 */

/*
 * Get all plans route
 */
router.get(
    '/plans/',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    controller.getPlans
)

/*
 * Get checkout route
 */
router.get(
    '/checkout/',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    controller.createCheckout
)

/*
 * Create new payment route
 */
router.post(
    '/checkout/',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    //validate
    trimRequest.all
)

/*
 * Get customer route
 */
router.get(
    '/customer/',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    controller.getCustomer
)

/*
 * Get customer address route
 */
router.get(
    '/customer/address',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    controller.getAddress
)

/*
 * Create customer address route
 */
router.post(
    '/customer/address',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    validate.paymentCustomerCreateAddress,
    controller.createAddress
)

/*
 * Create customer address route
 */
router.patch(
    '/customer/address/:id',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    validate.paymentCustomerUpdateAddress,
    controller.updateAddress
)

/*
 * Create customer address route
 */
router.delete(
    '/customer/address/:id',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    validate.paymentCustomerSetDelAddress,
    controller.removeAddress
)

/*
 * Create customer address route
 */
router.put(
    '/customer/address/:id',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    validate.paymentCustomerSetDelAddress,
    controller.setAddress
)

module.exports = router

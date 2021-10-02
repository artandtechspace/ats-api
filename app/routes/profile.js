const controller = require('../controllers/profile')
const validate = require('../validate/profile.validate')
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
 * Profile endpoints
 */


/**
 * Empty profile endpoint
 * @type get
 * @authorization user, admin
 * @author Luca Schöneberg
 */
router.get(
    '/',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    controller.getProfile
)

/*
 * Update profile endpoint
 */
router.patch(
    '/',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    validate.updateProfile,
    controller.updateProfile
)

/*
 * Change password endpoint
 */
router.post(
    '/changePassword',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    validate.changePassword,
    controller.changePassword
)

module.exports = router

const controller = require('../controllers/userPermissionAccess')
const validate = require('../controllers/userPermissionAccess.validate')
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
 * UserPermissionAccess routes
 */

/*
 * Get items route
 */
router.get(
    '/',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    controller.getItems
)

router.post(
    '/',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    validate.createItem,
    controller.createItem
)

router.post(
    '/:id',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    controller.closeItem
)

module.exports = router

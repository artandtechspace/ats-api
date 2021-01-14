const controller = require('../controllers/userPermission')
const validate = require('../controllers/userPermission.validate')
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

module.exports = router

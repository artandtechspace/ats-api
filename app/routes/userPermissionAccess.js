const controller = require('../controllers/userPermissionAccess')
const validate = require('../controllers/userPermissionAccess')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
    session: false
})
const trimRequest = require('trim-request')
const {validationResult} = require("../middleware/utils");
const {check, oneOf} = require('express-validator')
/*
 * UserPermissionAccess routes
 */

router.post(
    '/',
    requireAuth,
    AuthController.roleAuthorization(['user', 'admin']),
    trimRequest.all,
    oneOf([
        check('permissionId')
            .exists()
            .withMessage('MISSING')
            .not()
            .isEmpty()
            .withMessage('IS_EMPTY')
            .isMongoId()
            .withMessage('USERID_NOT_MONGOID'),
        check('permission')
            .exists()
            .withMessage('MISSING')
            .not()
            .isEmpty()
            .withMessage('IS_EMPTY'),
    ]),
    (req, res, next) => {
        validationResult(req, res, next)
    },
    controller.createItem
)

module.exports = router

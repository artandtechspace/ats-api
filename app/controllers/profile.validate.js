const {validationResult} = require('../middleware/utils')
const validator = require('validator')
const {check} = require('express-validator')

/**
 * Validates update profile request
 */
exports.updateProfile = [
    check('name')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('phone')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .trim(),
    check('city')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .trim(),
    check('country')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .trim(),
    check('email')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isEmail()
        .withMessage('EMAIL_IS_NOT_VALID'),
    check('idDiscord')
        .optional()
        .isNumeric()
        .withMessage('NOT_A_VALID_DISCORD_ID'),
    check('urlGitHub')
        .optional()
        .isEmail()
        .withMessage('NOT_A_VALID_EMAIL'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates change password request
 */
exports.changePassword = [
    check('oldPassword')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isLength({
            min: 5
        })
        .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
    check('newPassword')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isLength({
            min: 5
        })
        .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

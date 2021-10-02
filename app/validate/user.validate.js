const {validationResult} = require('../middleware/utils')
const validator = require('validator')
const {check} = require('express-validator')

/**
 * Validates create new item request
 */
exports.createItem = [
    check('firstname')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('lastname')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('email')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isEmail()
        .withMessage('EMAIL_IS_NOT_VALID'),
    check('password')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isLength({
            min: 5
        })
        .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
    check('role')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isIn(['user', 'admin'])
        .withMessage('USER_NOT_IN_KNOWN_ROLE'),
    check('phone')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .trim(),
    check('country')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .trim(),
    check('urlGitHub')
        .optional()
        .isEmail()
        .withMessage('NOT_A_VALID_EMAIL'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates update item request
 */
exports.updateItem = [
    check('firstname')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('lastname')
        .optional()
        .not()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('email')
        .optional()
        .not()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('role')
        .optional()
        .not()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('phone')
        .optional()
        .not()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .trim(),
    check('country')
        .optional()
        .not()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .trim(),
    check('urlTwitter')
        .optional()
        .custom(v => (v === '' ? true : validator.isURL(v)))
        .withMessage('NOT_A_VALID_URL'),
    check('urlGitHub')
        .optional()
        .custom(v => (v === '' ? true : validator.isURL(v)))
        .withMessage('NOT_A_VALID_URL'),
    check('id')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates get item request
 */
exports.getItem = [
    check('id')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates delete item request
 */
exports.deleteItem = [
    check('id')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

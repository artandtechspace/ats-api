const {validationResult} = require('../middleware/utils')
const {check} = require('express-validator')

exports.createItem = [
    check('permission')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('permissionname')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('type')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('ipaddress')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isIP()
        .withMessage('IPADDRESS_IS_NOT_VALID'),
    check('description')
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

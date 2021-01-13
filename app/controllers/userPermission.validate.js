const {validationResult} = require('../middleware/utils')
const validator = require('validator')
const {check} = require('express-validator')

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
 * Validates create new item request
 */
exports.createItem =[
    check('id')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('permission')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isMongoId()
        .withMessage('PERMISSIONID_NOT_MONGOID'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]
const {validationResult} = require('../middleware/utils')
const validator = require('validator')
const {check} = require('express-validator')


/**
 * Validates create new item request
 */
exports.createItem = [
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
            .withMessage('IS_EMPTY')
    ],"ONEOF_permissionId_permission"),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]
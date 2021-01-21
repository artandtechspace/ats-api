const {validationResult} = require('../middleware/utils')

const {check, oneOf} = require('express-validator');


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
            .withMessage('IS_EMPTY'),
    ]),
    (req, res, next) => {
        validationResult(req, res, next)
    },
]
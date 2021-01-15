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
        .withMessage('IS_EMPTY')
        .isMongoId()
        .withMessage('USERID_NOT_MONGOID'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates create new item request
 */
exports.createItem = [
    check('id')
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
        .isMongoId()
        .withMessage('PERMISSIONID_NOT_MONGOID'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates revoke new item request
 */
exports.revokeItem = [
    check('id')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isMongoId()
        .withMessage('USERID_NOT_MONGOID'),
    check('permissionIdLink')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isMongoId()
        .withMessage('PERMISSIONIDLINK_NOT_MONGOID'),
    check('revokemessage')
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
 * Validates revoke new item request
 */
exports.pardonRevokeItem = [
    check('id')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isMongoId()
        .withMessage('USERID_NOT_MONGOID'),
    check('permissionIdLink')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isMongoId()
        .withMessage('PERMISSIONIDLINK_NOT_MONGOID'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

/**
 * Validates revoke new item request
 */
exports.revokeItemUpdate = [
    check('id')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isMongoId()
        .withMessage('USERID_NOT_MONGOID'),
    check('revokeid')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isMongoId()
        .withMessage('REVOKE_ID_NOT_MONGOID'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]
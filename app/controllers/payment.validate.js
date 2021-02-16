const {validationResult} = require('../middleware/utils')
const {check, param} = require('express-validator')

exports.paymentCustomerCreateAddress = [
    check('firstName')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('lastName')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('company')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('streetAddress')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isLength({
            min: 2
        })
        .withMessage('STREETADDRESS_TOO_SHORT_MIN_2'),
    check('extendedAddress')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('locality')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('postalCode')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isLength({
            min: 5
        })
        .withMessage('POSTALCODE_TOO_SHORT_MIN_5'),
    check('countryCodeAlpha2')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isISO31661Alpha2()
        .withMessage('COUNTRYCODEALPHA2_IS_NOT_ISO_31661_ALPHA2'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

exports.paymentCustomerSetDelAddress = [
    param('id')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

exports.paymentCustomerUpdateAddress = [
    param('id')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('firstName')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('lastName')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('company')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('streetAddress')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isLength({
            min: 2
        })
        .withMessage('STREETADDRESS_TOO_SHORT_MIN_2'),
    check('extendedAddress')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('locality')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('postalCode')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isLength({
            min: 5
        })
        .withMessage('POSTALCODE_TOO_SHORT_MIN_5'),
    check('countryCodeAlpha2')
        .optional()
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isISO31661Alpha2()
        .withMessage('COUNTRYCODEALPHA2_IS_NOT_ISO_31661_ALPHA2'),
    (req, res, next) => {
        validationResult(req, res, next)
    }
]

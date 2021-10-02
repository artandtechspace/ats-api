const controller = require('../controllers/accessControl')
const validate = require('../validate/accessControl.validate')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Access Control routes
 */

/*
 * Register desfire
 */
router.post(
    '/desfire',
    trimRequest.all,
    validate.desfire,
    controller.createAssignDesfire
)

router.post(
    '/checkForAuth',
    trimRequest.all,
    validate.checkForAuth,
    controller.checkForAuth
)

router.post(
    '/',
    trimRequest.all,
    validate.createDevice,
    controller.createDevice
)



module.exports = router

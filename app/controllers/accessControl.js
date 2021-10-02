const model = require("../models/accessControl");
const utils = require("../middleware/utils");
const {response} = require("express");
const {matchedData, check} = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/user");
const accessControl = require("../models/accessControl");
const accessControlMiddelware = require("../middleware/accessControl")
const authMiddelware = require("../middleware/auth")
const activeDirectory = require("../middleware/activeDirectory");

/**
 * Finds user by ID
 * @param {string} accessControllId - accessControll´s id
 */
const findAccessControllById = async accessControllId => {
    return new Promise((resolve, reject) => {
        accessControl.findById(accessControllId, (err, item) => {
            utils.itemNotFound(err, item, 'ACCESS_CONTROLL_DOES_NOT_EXIST')
            resolve(item)
        })
    })
}
/**
 * Finds user by ID
 * @param {string} userId - user´s id
 */
const findUserById = async userId => {
    return new Promise((resolve, reject) => {
        User.findById(userId, (err, item) => {
            utils.itemNotFound(err, item, 'USER_DOES_NOT_EXIST')
            resolve(item)
        })
    })
}

/**
 * Updates a user desfireCardSecret in database
 * @param desfireSecret - desfireSecret
 * @param {Object} user - user object
 */
const updateDesfireSecret = async (desfireSecret, user) => {
    return new Promise((resolve, reject) => {
        user.desfireSecret = desfireSecret
        user.save((err, item) => {
            utils.itemNotFound(err, item, 'NOT_FOUND')
            resolve(item)
        })
    })
}

/**
 * Creates new accesControl
 * @param {Object} data - data object
 */
const createItem = async data => {
    return new Promise((resolve, reject) => {
        const accessC = new accessControl({
            name: data.name,
            adGroupId: data.adGroupId,
            deviceSecret: data.deviceSecret,
            macAddress: data.macaddress,
        })
        accessC.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            resolve(item)
        })
    })
}

/********************
 * Public functions *
 ********************/

//TODO: Check if Card Serialnumber already exists.
//TODO: Mit Erik klären ob man evtl. einen Karten Pool macht
/**
 * Assign a DesfireCard to a User
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createAssignDesfire = async (req, res) => {
    try {
        const data = matchedData(req)
        const user = await findUserById(data.id)
        const desfireSecret = await utils.createSecret()
        //TODO: Save desfireUuid
        await updateDesfireSecret(desfireSecret, user)
        res.status(200).json({
            desfiresecret: desfireSecret,
            userid: user._id
        })
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.createDevice = async (req, res) => {
    try {
        const data = matchedData(req)
        data.displayName = "FA_ESP_Zugang_" + data.name;
        data.name = 'faespzugang' + data.name
        const group = await activeDirectory.createGroup({
            displayName: data.displayName,
            mailEnabled: false,
            mailNickname: data.name,
            securityEnabled: true
        })
        data.deviceSecret = await utils.createSecret()
        data.adGroupId = group.id
        const item = await createItem(data)
        item.deviceSecret = data.deviceSecret
        res.status(200).json({
            adGroup: group,
            device: item
        })
    } catch (error) {
        utils.handleError(res, error)
    }
}

//TODO: ESP32 Anfrage ob der User mit der Desfire karte zugriff hat
/**
 * ESP32 Anfrage to a User
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.checkForAuth = async (req, res) => {
    try {
        const data = matchedData(req)
        const device = await findAccessControllById(data.deviceid)
        console.log(data)
        const user = await findUserById(data.userid)
        const checkDesfireSecret = await authMiddelware.checkDesfireSecret('b34b9253ae8f97bbd202c04cc8fd3bf9883aa921c00bcafb08b24f9e1141a55a637dd61be10af23a003df2f51c075dfb7a655c8f3cd4ef71aa46273e5770e2eb', user)
        console.log(checkDesfireSecret)
        const allowAccess = await activeDirectory.checkMemberGroup(user.adUuid, device.adGroupId)
        res.status(200).json({
            allowAccess: allowAccess,//or False
            desfireSecret: data.desfiresecret,
            deviceSecret: data.devicesecret
        })
    } catch (error) {
        utils.handleError(res, error)
    }
}


//TODO: ESP32 schließen des Aktuellen Maschinen zugriffs mit vorher übergebenen ampereSecret

//TODO: APP: User gesteuertes abschalten der maschine über app ?

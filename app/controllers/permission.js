const model = require('../models/permission')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const permissioner = require('../middleware/permissioner')
const {matchedData} = require('express-validator')

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async req => {
    return new Promise((resolve, reject) => {
        const permission = new model({
            permission: req.permission,
            type: req.type,
            description: req.description,
        })
        permission.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            resolve(item)
        })
    })
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
    try {
        req = matchedData(req)
        const doesPermissionExists = await permissioner.permissionExists(req.permission)
        if (!doesPermissionExists) {
            const item = await createItem(req)
            res.status(201).json(item)
        }
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Get items function called by route
 * @param req
 * @param res
 */
exports.getItems = async (req, res) => {
    try {
        const query = await db.checkQueryString(req.query)
        res.status(200).json(await db.getItems(req, model, query))
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
    try {
        req = matchedData(req)
        const id = await utils.isIDGood(req.id)
        res.status(200).json(await db.getItem(id, model))
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
    try {
        const id = await utils.isIDGood(req.params.id)
        req = matchedData(req)
        const doesPermissionExists = await permissioner.permissionExists(id)
        if (!doesPermissionExists) {
            res.status(200).json(await db.updateItem(id, model, req))
        }
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
    try {
        req = matchedData(req)
        const id = await utils.isIDGood(req.id)
        res.status(200).json(await db.deleteItem(id, model))
    } catch (error) {
        utils.handleError(res, error)
    }
}
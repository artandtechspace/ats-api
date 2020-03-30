const express = require('express');
const Group = require('../models/group');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/group', auth.auth, async (req, res) => {
    // Create a new group
    try {
        const group = new Group(req.body);
        await group.save();
        res.status(201).send(group);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/group/me/logout', auth.auth, async (req, res) => {
    // Log group out of the application
    try {
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/group/me/logoutall', auth.auth, async (req, res) => {
    // Log group out of all devices
    try {
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/group/me/update', auth.auth, async (req, res) => {
    try {
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
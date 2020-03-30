const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/user', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (Error) {
        res.status(400).send(Error);
    }
});

router.post('/user/login', async (req, res) => {
    //Login a registered user
    try {
        const {email, password} = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (Error) {
        res.status(400).send(Error)
    }

});

router.get('/user/me', auth.auth, async (req, res) => {
    // View logged in user profile
    res.send(req.user);
});

router.post('/user/me/logout', auth.auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        });
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/user/me/logoutall', auth.auth, async (req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        res.send()
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/user/me/update', auth.auth, async (req, res) => {
    try {
        if (req.body.password) {
            const password = new User(req.body);
            req.body.password = await password.hashPassword();
        }
        const update = await User.findByIdAndUpdate(req.body._id, req.body);
        if (!update) {
            return res.status(401).send({error: 'Fail'})
        }
        const user = await User.findOne({_id: req.body._id});
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/user/me/group', auth.auth, async (req, res) => {
    //Login a registered user
    try {
        const {email, password} = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (Error) {
        res.status(400).send(Error)
    }

});

module.exports = router;
const passport = require('passport')
const User = require('../app/models/user')
const UserAccess = require('../app/models/userAccess')
const auth = require('../app/middleware/auth')
const JwtStrategy = require('passport-jwt')

/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string|null} token - decrypted token
 */
const jwtExtractor = (req) => {
    let token = null
    if (req.headers.authorization) token = req.headers.authorization.replace('Bearer ', '').trim()
    else if (req.body.token) token = req.body.token.trim()
    else if (req.query.token) token = req.query.token.trim()
    return token
}

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
    jwtFromRequest: jwtExtractor,
    secretOrKey: process.env.JWT_SECRET
}

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy.Strategy(jwtOptions, (payload, done) => {
    User.findById(payload.data._id.toString(), (err, user) => {
        if (err) return done(err, false)
        return !user ? done(null, false) :
            UserAccess.findById(payload.data._aid, (err, item) => {
                if (err) return done(err, false)
                return !item ? done(null, false) : done(null, user)
            })
    })
})

passport.use(jwtLogin)

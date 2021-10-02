require('dotenv-safe').config()
const express = require('express')
const listEndpoints = require("express-list-endpoints")
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const https = require('https')
const http = require('http')
const passport = require('passport')
const app = express()
const i18n = require('i18n')
const initMongo = require('./config/mongo')
const path = require('path')
const fs = require('fs')
// Setup express server port from ENV, default: 3000
app.set('port', process.env.PORT || 3000)
app.set('accessToken', null)

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Redis cache enabled by env variable
if (process.env.USE_REDIS === 'true') {
    const getExpeditiousCache = require('express-expeditious')
    const cache = getExpeditiousCache({
        namespace: 'expresscache',
        defaultTtl: '1 minute',
        engine: require('expeditious-engine-redis')({
            redis: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            }
        })
    })
    app.use(cache)
}

// for parsing json
app.use(
    bodyParser.json({
        limit: '20mb'
    })
)

// for parsing application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        limit: '20mb',
        extended: true
    })
)

// i18n
i18n.configure({
    locales: ['en', 'es', 'de'],
    directory: `${__dirname}/locales`,
    defaultLocale: 'de',
    objectNotation: true
})
app.use(i18n.init)

// Init all other stuff
app.use(cors())
app.use(passport.initialize())
app.use(compression())
app.use(helmet())
app.disable('x-powered-by')
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(require('./app/routes'))


// Init HTTP server
const httpServer = http.createServer(app);
httpServer.listen(app.get('port'));

if (process.env.USE_SECURE === 'true') {
    const httpsServer = https.createServer({
        key: fs.readFileSync(process.env.SECURE_PRIVKEY),
        cert: fs.readFileSync(process.env.SECURE_FULLCHAIN),
    }, app)
    httpsServer.listen(process.env.SECURE_PORT || 3443, () => {
        console.log('SECURE Server running on port ' + process.env.SECURE_PORT || 3443);
    })
}

// List all api endpoints
console.table(listEndpoints(app), ['path', 'methods'])

// Init MongoDB
initMongo()

module.exports = app

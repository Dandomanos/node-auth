'use strict'

const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const expressDeliver = require('express-deliver')
const mongoose = require('mongoose')
const config = require('../config/main')

require('./exceptions')

module.exports = app => {
    expressDeliver(app,{
        printErrorStack: true, //Default: false 
        printInternalErrorData: true //Default: false * 
    })

    mongoose.connect(config.database)
    mongoose.Promise = global.Promise

    app.use(morgan('dev'))
    app.use(cors())
    app.use(bodyParser.json())

    require('./routes')(app)

    expressDeliver.errorHandler(app)
}
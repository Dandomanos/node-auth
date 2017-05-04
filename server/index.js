const express = require('express'),
    app = express(),
    logger = require('morgan'),
    config = require('./config/main')

// Start the server
const server = app.listen(config.port)
console.log('Server running on port ' + config.port + '.')

// Setting up a basic middleware using morgan
app.use(logger('dev'))

// Enable CORS from client-side
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Credentials")
    res.header("Access-Control-Allow-Credentials", "true")
    next()
})
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose')
    config = require('./app/config/main')



var server = require('http').Server(app);

// const Socket = require('./socket.js')
const io = require('socket.io')(server)
// const io = socketIo.listen(server)
const socketEvents = require('./app/socketEvents')

socketEvents.set(io)
socketEvents.initEvents()

require('./app/bootstrap')(app)

// Start the server
server.listen(config.port, function(){
    console.log('Server running on port ' + config.port + '.')
})

// Enable CORS from client-side
// app.use((req,res,next) => {
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Credentials")
//     res.header("Access-Control-Allow-Credentials", "true")
//     next()
// })

// Adding Body parser
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// router(app)
'use strict'

const {exception} = require('express-deliver')

exception.define({
    name:'USER_NOT_FOUND',
    code:2000,
    message:'User not found',
    statusCode:401
})

exception.define({
    name:'INVALID_PASSWORD',
    code:2001,
    message:'Invalid Password',
    statusCode:401
})

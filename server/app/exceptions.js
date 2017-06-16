'use strict'

const {exception} = require('express-deliver')

exception.define({
    name:'UserNotFound',
    code:2000,
    message:'User not found',
    statusCode:401
})

exception.define({
    name:'InvalidPassword',
    code:2001,
    message:'Invalid Password',
    statusCode:401
})

exception.define({
    name:'EmailNeeded',
    code:2002,
    message:'You must enter an email address.',
    statusCode:422
})

// exception.define({
//     name:'EMAIL_NEEDED',
//     code:2003,
//     message:'You must enter an email address.',
//     statusCode:422
// })

exception.define({
    name:'FullNameNeeded',
    code:2003,
    message:'You must enter your full name.',
    statusCode:422
})

exception.define({
    name:'PasswordNeeded',
    code:2005,
    message:'You must enter a password.',
    statusCode:422
})

exception.define({
    name:'EmailUsed',
    code:2006,
    message:'Your email is already in use.',
    fields: ['email'],
    statusCode:422
})




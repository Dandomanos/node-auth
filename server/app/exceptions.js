'use strict'

const {ExceptionPool} = require('express-deliver')

const exceptionPool = new ExceptionPool({
    UserNotFound: {
        code:2000,
        message:'User not found',
        statusCode:401
    },
    InvalidEmailPassword: {
        code:2001,
        message:'Invalid Email Password',
        statusCode:401
    },
    EmailNeeded: {
        code:2002,
        message:'You must enter an email address.',
        statusCode:422
    },
    FullNameNeeded: {
        code:2003,
        message:'You must enter your full name.',
        statusCode:422
    },
    UsernameNeeded: {
        code:2004,
        message:'You must enter an Username.',
        statusCode:422
    },
    PasswordNeeded: {
        code:2005,
        message:'You must enter a password.',
        statusCode:422
    },
    EmailUsed: {
        code:2006,
        message:'Your email is already in use.',
        statusCode:422
    },
    UsernameUsed: {
        code:2007,
        message:'Your Username is already in use.',
        statusCode:422
    },
    NewPasswordConfirmNeeded: {
        code:2008,
        message:'You must enter a new Password and confirm him.',
        statusCode:422
    },
    InvalidPassword: {
        code:2009,
        message:'Invalid Password',
        statusCode:401
    },
})

module.exports = exceptionPool




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
    EmailNotFound: {
        code:2010,
        message:'Email not registered',
        statusCode:401
    },
    ShippingFailed: {
        code:2011,
        message:'Email couldn\'t be send' ,
        statusCode:401
    },
    ErrorUpdating: {
        code:2012,
        message:'Error updating user' ,
        statusCode:401
    },
    InvalidToken: {
        code:2012,
        message:'Invalid Token' ,
        statusCode:401
    },
    CreateGameFailed: {
        code:2013,
        message:'Error creating a game' ,
        statusCode:401
    },
    NoGamesCreated: {
        code:2014,
        message:'No games created' ,
        statusCode:401
    },
    UnknowGame: {
        code:2015,
        message:'Unknow Game' ,
        statusCode:401
    },
    CantPopulateUsers: {
        code:2016,
        message:'Failed populating users on a game' ,
        statusCode:401
    },
    Occupied: {
        code:2017,
        message:'A player is sitted on this place' ,
        statusCode:401
    },
    DeleteGameFailed: {
        code:2018,
        message:'Fail deleting a game' ,
        statusCode:401
    },
    YouCantPlayNow: {
        code:2019,
        message:'You cant play now' ,
        statusCode:401
    },
    YouAreNotInTheGame: {
        code:2020,
        message:'You are not in the game' ,
        statusCode:401
    },
    UnknowParams: {
        code:2021,
        message:'Wrong params' ,
        statusCode:401
    },
    YouCantSing: {
        code:2022,
        message:'You cant sing this turn' ,
        statusCode:401
    }
})

module.exports = exceptionPool




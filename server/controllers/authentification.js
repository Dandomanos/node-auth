const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/user')
const config = require('../config/main')
const fs = require('fs-extra')
const path = require('path')


function generateToken(user) {
    return jwt.sign(user,config.secret)
}

//Set user info from request
function setUserInfo(request) {
    return {
        _id: request._id,
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        role: request.role
    }
}

//========================================
// Login Route
//========================================
exports.login = function*(req) {

    let userInfo = setUserInfo(req.user)

    return {
        token: 'JWT ' + generateToken(userInfo._id.toString()),
        user: userInfo
    }
}

//========================================
// Auth Route
//========================================
exports.auth = (req, res, next) => {
    res.send('It worked! User id is: ' + req.user._id + '.');
}

//========================================
// Users Route
//========================================
exports.users = function*(req) {
    let userInfo = setUserInfo(req.user)

    let users = yield User.find( {} )
    if(!users) {
        console.log('users not found')
        throw new Error ('user not found')
    }
    let usersInfo = users.map( user => setUserInfo(user))
    return {
        user: userInfo,
        users: usersInfo
    }

}
// exports.users = function(req,res) {
//     res.send(':(')
// }

//========================================
// Admin Users Route
//========================================
exports.adminUsers = (req, res, next) => {

    User.find(function(err,users){
        if(err) { return next(err) }

        let response = {
            user : setUserInfo(req.user),
            users: users.map(user => setUserInfo(user))
        }

        res.status(200).send(response)

    })
}


//========================================
// Registration Route
//========================================
exports.register = (req, res, next) => {
    // Check for registration errors
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password
    const role = req.body.role
    if(!email) {
        return res.status(422).send({error: 'You must enter an email address.'})
    }

    if(!firstName || !lastName) {
        return res.status(422).send({error: 'You must enter your full name.'})
    }

    if(!password) {
        return res.status(422).send({error: 'You must enter a password.'})
    }

    User.findOne({ email: email }, (err, existingUser) => {
        if(err) { return next(err) }

        if(existingUser) {
            return res.status(422).send({error: 'That email address is already in use.'})
        }

        let user = new User({
            email: email,
            password: password,
            profile: { firstName: firstName, lastName: lastName },
            role: role
        })

        user.save((err, user) => {
            if(err) { return next(err) }

            // send email for double optin

            let userInfo = setUserInfo(user)

            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo._id),
                user: userInfo
            })

        })
    })
}

//========================================
// Authorization Middleware
//========================================

//Role authorization check
// exports.roleAuthorization = role => {
//     return (req, res, next) => {
//         const user = req.user
//         User.findById(user._id, (err, foundUser) => {
//             if(err) {
//                 console.log('error', err)
//                 res.status(422).json({ error: 'No user was found'})
//             }

//             if(foundUser.role == role) {
//                 console.log('foundUser.role', role)
//                 return next()
//             }

//             res.status(401).json({error:'User unauthorized', role: user.role})
//             return next('Unauthorized')
//         })
//     }
// }

//Public Home
exports.publicHome = (req, res, next)  => {
    res.status(200).json({
        title:'Welcome to home view',
        content: 'This is the starting view'
    })
}

exports.authenticationFail = (err,req,res,next)=>{
    throw new res.exception.Unauthorized()
}
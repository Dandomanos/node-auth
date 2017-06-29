const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/user')
const config = require('../config/main')
const fs = require('fs-extra')
const path = require('path')
const expressDeliver = require('express-deliver')
const generator = require('generate-password');

//NODEMAILER
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'infocelmmessenger@gmail.com',
    pass: 'Man12125'
  }
})




function generateToken(user) {
    return jwt.sign(user,config.secret)
}

//Set user info from request
function setUserInfo(request) {
    return {
        _id: request._id,
        games:request.games,
        emailActive:request.emailActive,
        username: request.username || '',
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        role: request.role
    }
}

function getQuery(path) {
    let url = require('url')
    let url_parts = url.parse(path, true)
    let query = url_parts.query
    return query
}

//========================================
// Login Route
//========================================
exports.login = function*(req) {

    console.log('req body', req.body)
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

    let query = getQuery(req.url)
    if(query.onlySelf)
        return { user: userInfo }

    let users = yield User.find( {} )
    if(!users) {
        console.log('users not found')
        throw new Error ('user not found')
    }
    // console.log('users', users)
    let usersInfo = users.map( user => setUserInfo(user))
    return {
        user: userInfo,
        users: usersInfo
    }

}

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
// Update Profile Route
//========================================
exports.updateProfile = function*(req, res, next) {
    console.log('updating profile', req.body,req.user._id)
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const username = req.body.username

    if(!username)
        throw new res.exception.UsernameNeeded()

    if(!firstName || !lastName) {
         throw new res.exception.FullNameNeeded()
    }

    let freeUsername = yield User.findOne({ username: username })
    // console.log('freeUsername', freeUsername._id, req.user._id)
    if(freeUsername && freeUsername._id.toString() !== req.user._id.toString())
        throw new res.exception.UsernameUsed()

    let updatedUser = yield User.findOneAndUpdate({ _id: req.user._id },{username:username,profile:{firstName:firstName,lastName:lastName}})

    console.log('user updated', updatedUser)
    let user = setUserInfo(updatedUser)
    user.firstName = firstName
    user.lastName = lastName
    user.username = username
    return {
        msg: 'user updated',
        user: user
    }

}

//========================================
// Update Profile Route
//========================================
exports.changePassword = function*(req, res, next) {
    console.log('updating profile', req.body,req.user._id)
    const password = req.body.password
    const newPassword = req.body.newPassword
    const confirmed = req.body.confirmNewPassword

    if(!password)
        throw new res.exception.PasswordNeeded()

    if(!newPassword || !confirmed) {
         throw new res.exception.NewPasswordConfirmNeeded()
    }

    let user = yield User.findOne( { _id: req.user._id })
    if(!user)
        throw new res.exception.UserNotFound()
    

    let matched = yield new Promise((resolve,reject)=>{
        user.comparePassword(password, (err, isMatch) => {
            if(err) { return reject(err) }
            resolve(isMatch)
        })
    })

    if (!matched)
        throw new res.exception.InvalidPassword()

    console.log('matched', matched)
    console.log('user', user)
    user.password = newPassword
    let userSaved = yield user.save()

    // let passUpdated = yield User.findOneAndUpdate({ _id: req.user._id },{password:password}) 
    
    
    // console.log('user updated', updatedUser)
    return {
        msg: 'password updated',
        newPass: newPassword
    }

}

//========================================
// Generate new Password
//========================================
exports.recoverPass = function*(req, res, next) {
    console.log('starting recovering pass', req.body)
    const email = req.body.email

    if(!email)
        throw new res.exception.UsernameNeeded()

    let user = yield User.findOne({ email: email })

    if(!user) {
        throw new res.exception.EmailNotFound()
    }

    let newPass =  generator.generate({ length: 10, numbers: true })

    user.password = newPass
    let userSaved = yield user.save()

    let mailOptions = {
        from: 'info@celm.com',
        to: email,
        subject: 'CELM => New Password Generated',
        html: 'Hi ' + email + ' your new password has been generated<br><br>' + '<b>' + newPass + '</b>'
    }

    let sended = yield transporter.sendMail(mailOptions)

    if(!sended) {
        throw new res.exception.ShippingFailed()
    }

    console.log('Email sent: ' + sended.response)

    return {
        // user: setUserInfo(user),
        message:'Password Generated Succesfully'
    }
}
//========================================
// Registration Route
//========================================
exports.register = function*(req, res, next) {
    // Check for registration errors
    console.log('starting register', req.body)
    const username = req.body.username
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password
    const role = req.body.role
    console.log('firstName', firstName)

    if(!username)
        throw new res.exception.UsernameNeeded()
    
    if(!email) {
        throw new res.exception.EmailNeeded()
    }

    if(!firstName || !lastName) {
         throw new res.exception.FullNameNeeded()
    }

    if(!password) {
        throw new res.exception.PasswordNeeded()
    }

    let freeUsername = yield User.findOne({ username: username })
    if(freeUsername)
        throw new res.exception.UsernameUsed()

    let existingUser = yield User.findOne({ email: email })


    if(existingUser) {
        throw new res.exception.EmailUsed()
    }
    console.log('firstName before created', firstName)
    let user = new User({
        emailActive:false,
        games: [],
        username: username,
        email: email,
        password: password,
        profile: { firstName: firstName, lastName: lastName },
        role: role
    })

    console.log('creating user', user)

    let userSaved = yield user.save()
    let userInfo = setUserInfo(user)
    console.log('user saved')
    return {
        token: 'JWT ' + generateToken(userInfo._id.toString()),
        user: userInfo
    }

}

//========================================
// Authorization Middleware
//========================================

// Role authorization check
exports.roleAuthorization = role => {
    return (req, res, next) => {
        const user = req.user
        User.findById(user._id, (err, foundUser) => {
            if(err) {
                console.log('error', err)
                res.status(422).json({ error: 'No user was found'})
            }

            if(foundUser.role == role) {
                console.log('foundUser.role', role)
                return next()
            }

            res.status(401).json({error:'User unauthorized', role: user.role})
            return next('Unauthorized')
        })
    }
}

//Public Home
exports.publicHome = (req, res, next)  => {
    res.status(200).json({
        title:'Welcome to home view',
        content: 'This is the starting view'
    })
}

exports.authenticationFail = (err,req,res,next)=>{
    console.log('authentificationFail')
    throw new res.exception.Unauthorized()
}

const jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
    User = require('../models/user')
    config = require('../config/main')

function generateToken(user) {
    return jwt.sign(user,config.secret, {
        expiresIn: 10080 // in seconds 
    })
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
exports.login = (req, res, next) => {

    let userInfo = setUserInfo(req.user)

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    })
}

//========================================
// Auth Route
//========================================
exports.auth = (req, res, next) => {
    res.send('It worked! User id is: ' + req.user._id + '.');
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
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            })

        })
    })
}

//========================================
// Authorization Middleware
//========================================

//Role authorization check
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
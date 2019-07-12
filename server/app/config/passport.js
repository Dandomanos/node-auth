const passport = require('passport'),
    User = require('../models/user'),
    config = require('./main'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    LocalStrategy = require('passport-local')
    exception = require('../exceptions')

const localOptions = { usernameField: 'email'}
const expressDeliver = require('express-deliver')
// const debug = require('debug')('passport')

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // console.log('email', email, password)
    User.findOne( {email: email} , (err, user) => {
        if(err) { return done(err) }
        if(!user) {
            // console.log('user not found')
            return done(new exception.InvalidEmailPassword())
        }

        user.comparePassword(password, function (err, isMatch) {
            
            if(err) { return done(err) }
            if(!isMatch) { return done(new exception.InvalidEmailPassword())}

            return done(null, user)
        })
    })
})

const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    // Telling Passport where to find the secret
    secretOrKey: config.secret
}

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload, (err, user) => {
        if (err) { return done(err, false) }

        if(user) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
})

passport.use(jwtLogin)
passport.use(localLogin)
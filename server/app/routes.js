const AuthenticationController = require('./controllers/authentification'),
    express = require('express'),
    expressDeliver = require('express-deliver'),
    passportService = require('./config/passport'),
    passport = require('passport')

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session:false })
const requireLogin = passport.authenticate('local', { session:false })

// Constant for role types
const REQUIRE_ADMIN = "Admin",
    REQUIRE_OWNER = "Owner",
    REQUIRE_CLIENT = "Client",
    REQUIRE_MEMBER = "Member"

module.exports = app => {

    // Initialize route groups
    const apiRoutes = express.Router()
    expressDeliver(apiRoutes)
    // const authRoutes = express.Router()

    //=========================
    // Auth Routes
    //=========================
    // Set url for API group routes

    // // Set auth routes as subgroup/middleare to apiRoutes
    // apiRoutes.use('/auth', authRoutes)

    // Registration route
    app.post('/register', AuthenticationController.register)

    // Login route
    app.post('/login', requireLogin, AuthenticationController.login)

    app.use('/api',
        passport.authenticate('jwt', { failWithError:true, session: false }),
        AuthenticationController.authenticationFail
    )
    app.use('/api',apiRoutes)


    // Protect dashboard route with JWT
    apiRoutes.get('/users', AuthenticationController.users)

    // Test Data Home
    apiRoutes.get('/home', AuthenticationController.publicHome)

    //Update Profile
    apiRoutes.post('/updateProfile', AuthenticationController.updateProfile)

    // Protect dashboard route with JWT and Admin Role user
    // apiRoutes.get('/admin', requireAuth, AuthenticationController.roleAuthorization('Admin'), AuthenticationController.adminUsers)

    
}
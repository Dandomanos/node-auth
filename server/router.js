const AuthenticationController = require('./controllers/authentification'),
    express = require('express'),
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
    const authRoutes = express.Router()

    //=========================
    // Auth Routes
    //=========================

    // Set auth routes as subgroup/middleare to apiRoutes
    apiRoutes.use('/auth', authRoutes)

    // Registration route
    authRoutes.post('/register', AuthenticationController.register)

    // Login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login)

    // Protect dashboard route with JWT
    apiRoutes.get('/dashboard', requireAuth, AuthenticationController.auth)

    // Protect dashboard route with JWT and Admin Role user
    apiRoutes.get('/admin', requireAuth, AuthenticationController.roleAuthorization('Admin'), AuthenticationController.adminUsers)

    // Set url for API group routes
    app.use('/api', apiRoutes)
}
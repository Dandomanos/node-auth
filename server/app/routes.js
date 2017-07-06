const AuthenticationController = require('./controllers/authentification'),
    GameController = require('./controllers/game'),
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

    //=========================
    // Unauth Routes
    //=========================

    // Registration route
    app.post('/register', AuthenticationController.register)

    // Login route
    app.post('/login', requireLogin, AuthenticationController.login)

    // Recover password
    app.post('/recover', AuthenticationController.recoverPass)

    // Confirm email
    app.post('/confirmEmail', AuthenticationController.confirmEmail)

    //=========================
    // Auth Routes
    //=========================

    // Protect dashboard route with JWT
    app.use('/api',
        passport.authenticate('jwt', { failWithError:true, session: false }),
        AuthenticationController.authenticationFail
    )
    app.use('/api',apiRoutes)


    // Send Confirmation Password
    apiRoutes.get('/sendConfirmationEmail', AuthenticationController.sendConfirmation)

    //Update Profile
    apiRoutes.post('/updateProfile', AuthenticationController.updateProfile)

    //Update Profile
    apiRoutes.post('/changePassword', AuthenticationController.changePassword)

    //=========================
    // GAMES Routes
    //=========================

    // Get Games
    apiRoutes.get('/games', GameController.getGames)

    // Set Player
    apiRoutes.post('/setPlayer', GameController.setPlayer)

    // Push Card
    apiRoutes.post('/pushCard', GameController.pushCard)

    //=========================
    // Admin Routes
    //=========================
 
    //Protect dashboard route with JWT and Admin Role user
    apiRoutes.get('/users', AuthenticationController.users)

    //Protect dashboard route with JWT and Admin Role user
    apiRoutes.post('/createGame', AuthenticationController.roleAuthorization('Admin'), GameController.createGame)

    apiRoutes.post('/deleteGame', AuthenticationController.roleAuthorization('Admin'), GameController.deleteGame)
}
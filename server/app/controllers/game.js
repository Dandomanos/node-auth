
const Game = require('../models/game')

const Db = require('./game/Db')
const Emitter = require('./game/Emitter')
const SO = new Emitter()
const DB = new Db()

const debug = require('debug')('GAME CONTROLLER => ')
debug.enabled = true
const reactionTime = 1500
const finishMatchTime = 2500

//========================================
// GET GAMES
//========================================
exports.getGames = function*(req) {
    return yield DB.getGames(req)
}

//========================================
// CREATE NEW GAME
//========================================
exports.createGame = function*(req, res) {

    let game = new Game()
    game.createGame(req.body.type)
    
    yield DB.saveGame(game)

    yield informGames(req)

    return {
        message:'game created'
    }
}

//========================================
// DELETE GAME
//========================================
exports.deleteGame = function*(req, res) {

    yield DB.deleteGame(req.body.gameId)

    yield informGames(req)

    return {
        message: req.body.gameId + ' Deleted',
        games:games
    }
}

//========================================
// PUSH CARD
//========================================
exports.pushCard = function*(req, res) {

    let game = yield DB.getGame(req.body.gameId)

    yield game.pushCard(req.user._id, req.body.card)

    yield saveAndInformPlayers(game)

    //check if round is finish to collect cards and emit a new update event
    if(game.allPushed()) {
        game.finishRound()
        yield saveAndInformPlayers(game, reactionTime)

        //check if game is finished
        if(game.isFinished()) {
            game.finishMatch()
            yield saveAndInformPlayers(game, finishMatchTime)
        }
    }

    return {
        message:'Card pushed'
    }
}

//========================================
// SET PLAYER IN A GAME
//========================================
exports.setPlayer = function*(req, res) {

    let game = yield DB.getGame(req.body.gameId)
    game.setPlayer(req)

    yield DB.saveGame(game)

    yield informGames(req)

    game = yield DB.getGame(req.body.gameId)

    if(game.isReady())
        game.startNewGame()

    yield saveAndInformPlayers(game)

    return {
            message:'user enter the game',
            game:game,
            games: games
    }
}

//========================================
// SET SOCKETID ON THE GAM
//========================================
exports.setSocketId = function*(req, res) {

    let game = yield DB.getGame(req.body.gameId)
    game.setSocketId(req)

    yield saveAndInformPlayers(game)

    return {
        message:'socketId updated'
    }
}

//========================================
// SET SING EXTRA POINTS ON THE GAME
//========================================
exports.setExtraPoints = function*(req, res) {

    let game = yield DB.getGame(req.body.gameId)

    game.setExtraPoints(req)

    yield saveAndInformPlayers(game)

    if(req.body.extraPoint.type === 'Tute') {

        game.singTute(req)

        yield saveAndInformPlayers(game,finishMatchTime)

    }

    return {
        message:'Extra Points setted'
    }
}


//========================================
// SET READY PLAYER IN A GAME
//========================================
exports.setReady = function*(req, res) {

    let game = yield DB.getGame(req.body.gameId)

    game.setReady(req.user._id)

    yield saveAndInformPlayers(game)

    return {
        message: 'Ready setted'
    }
}


/* Auxiliar functions */
const saveAndInformPlayers = function*(game, delay) {
    yield DB.saveGame(game)
    SO.emitPlayers(game, delay)
}
const informGames = function*(req) {
    let games = yield DB.getGames(req)
    SO.emitAll(games)
}
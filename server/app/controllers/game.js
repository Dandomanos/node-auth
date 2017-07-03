
const Game = require('../models/game')
const User = require('../models/user')
const config = require('../config/main')
const expressDeliver = require('express-deliver')

//========================================
// GET GAMES
//========================================
exports.getGames = function*(req) {
    let games = yield Game.find( {} )
    if(!games)
        throw new res.exception.NoGamesCreated()

    let populated = yield User.populate(games, {path: "players"})
    if(!populated)
        throw new res.exception.CantPopulateUsers()

    return {
            games:games
    }
}

//========================================
// CREATE NEW GAME
//========================================
exports.createGame = function*(req, res) {

    let type = req.body.type
    console.log('type of game', type)
    
    let game = new Game({
        type:type
    })

    console.log('creating game', game)

    let gameCreated = yield game.save()
    if(!gameCreated)
        throw new res.exception.CreateGameFailed()

    let games = yield Game.find( {} )
    if(!games)
        throw new res.exception.NoGamesCreated()

    return {
            message:'game created',
            games:games
    }
}

//========================================
// CREATE NEW GAME
//========================================
exports.setPlayer = function*(req, res) {
    let gameId = req.body.gameId
    let position = req.body.position
    let userId = req.user._id
    console.log('gameId', gameId)
    console.log('position', position)
    console.log('userId', userId)

    //check if the place is free
    let place = yield Game.findOne({ _id: gameId })
    if(!place)
        throw new res.exception.UnknowGame()

    if(place.players[position])
        throw new res.exception.Occupied()

    let placeholder = {};
    placeholder['players.' + position] = userId;
    // let game = yield Game.findOneAndUpdate( { _id: gameId } , { $push: { players: userId, $position: position } })
    let game = yield Game.findOneAndUpdate( { _id: gameId } , { $set: placeholder })
    if(!game)
        throw new res.exception.ErrorUpdating()

    console.log('game', game)

    let games = yield Game.find( {} )
    if(!games)
        throw new res.exception.NoGamesCreated()

    let populated = yield User.populate(games, {path: "players"})
    if(!populated)
        throw new res.exception.CantPopulateUsers()

    return {
            message:'user enter the game',
            game:game,
            games: games
    }
}



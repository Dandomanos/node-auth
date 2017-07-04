
const Game = require('../models/game')
const User = require('../models/user')
const config = require('../config/main')
const expressDeliver = require('express-deliver')
const mongoose = require('mongoose')

let players = {
    0: 2
}

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
        type:type,
        players: new Array(players[type])
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
// DELETE GAME
//========================================
exports.deleteGame = function*(req, res) {
    let gameId = req.body.gameId
    let deletedGame = yield Game.findOneAndRemove({_id:gameId})
    if(!deletedGame)
        throw new res.exception.DeleteGameFailed()

    let games = yield Game.find( {} )
    if(!games)
        throw new res.exception.NoGamesCreated()

    let populated = yield User.populate(games, {path: "players"})
    if(!populated)
        throw new res.exception.CantPopulateUsers()

    return {
        message: gameId + ' Deleted',
        games:games
    }
}

//========================================
// SET PLAYER IN A GAME
//========================================
exports.setPlayer = function*(req, res) {
    let gameId = req.body.gameId
    let position = req.body.position
    let userId = req.user._id
    console.log('gameId', gameId)
    console.log('position', position)
    console.log('userId', userId)

    //check if the place is free
    let game = yield Game.findOne({ _id: gameId })
    if(!game)
        throw new res.exception.UnknowGame()

    if(game.players[position])
        throw new res.exception.Occupied()

    // game.players.set(position, userId)
    // doc.array.set(index, value);
    
    game.players[position] = userId
    game.markModified('players')
    let saved = yield game.save()
    if(!saved)
        throw new res.exception.ErrorUpdating()

    // console.log('game', game)
    // let placeholder = {};
    // console.log('placeholder', placeholder)
    // placeholder['players.' + position] = userId;
    // console.log('placeholder', placeholder)
    
    // let gameUpdated = yield Game.findOneAndUpdate( { _id: gameId } , { $set: placeholder })
    // if(!gameUpdated)
    //     throw new res.exception.ErrorUpdating()

        

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



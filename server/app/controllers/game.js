
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

    let query = getQuery(req.url)
    if(query.game) {
        let game = yield Game.findOne( { _id: query.game} )
        if(!game)
            throw new res.exception.UnknowGame()

        let gamePopulated = yield User.populate(game, {path: "players"})
        if(!gamePopulated)
            throw new res.exception.CantPopulateUsers()

        return { game: game }
    }
        

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

    //create phantoms user
    game.players = game.players.map(()=>mongoose.Types.ObjectId('595b701b07770e46038c5877'))

    console.log('creating game', game)

    let gameCreated = yield game.save()
    if(!gameCreated)
        throw new res.exception.CreateGameFailed()

    let games = yield Game.find( {} )
    if(!games)
        throw new res.exception.NoGamesCreated()

    let populated = yield User.populate(games, {path: "players"})
    if(!populated)
        throw new res.exception.CantPopulateUsers()
    
    global.io.emit('updated', { games: games })

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
    
    global.io.emit('updated', { games: games })
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

    let popGame = yield User.populate(game, {path: "players"})
    if(!popGame)
        throw new res.exception.CantPopulateUsers()

    if(game.players[position].role!=='Phantom')
        throw new res.exception.Occupied()

    game.players[position] = userId
    game.markModified('players')

    let saved = yield game.save()
    if(!saved)
        throw new res.exception.ErrorUpdating()

    let games = yield Game.find( {} )
    if(!games)
        throw new res.exception.NoGamesCreated()

    let populated = yield User.populate(games, {path: "players"})
    if(!populated)
        throw new res.exception.CantPopulateUsers()
    
    global.io.emit('updated', { games: games })

    let gamePopulated = yield User.populate(game, {path: "players"})
    if(!gamePopulated)
        throw new res.exception.CantPopulateUsers()

    //check if game should start
    if(game.state===0 && gameFull(game.players)) {
        game.state=1
        game.desk = new Desk()
        console.log('Starting game, creating desk => ',game.desk)
        game.markModified('desk')
        let gameSaved = yield game.save()
        if(!gameSaved)
            throw new res.exception.ErrorUpdating()

    }

    global.io.emit('gameupdated', { game: game })

    return {
            message:'user enter the game',
            game:game,
            games: games
    }
}

//AUXILIAR FUNCTIONS

function gameFull(players) {
    return players ? players.filter( item => item.role === 'Phantom' ).length <= 0 : false
}

class Desk {
    constructor(){
        this.types = ['Oros','Copas', 'Espadas', 'Bastos']
        this.numbers = [1,2,3,4,5,6,7,10,11,12]
        return this.createDesk()
    }
    createCard(number, type) {
        return {
            'number':number,
            'type':type
        }
    }
    createType(type) {
        return this.numbers.map((number)=> this.createCard(number, type))
    }
    createDesk() {
        console.log('types', this.types)
        return this.types.map((type)=>this.createType(type)).reduce((prev, cur) => prev.concat(cur), []).sort(() => (Math.random() - 0.5))
    }
}

function getQuery(path) {
    let url = require('url')
    let url_parts = url.parse(path, true)
    let query = url_parts.query
    return query
}



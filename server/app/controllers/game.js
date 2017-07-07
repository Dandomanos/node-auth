
const Game = require('../models/game')
const User = require('../models/user')
const config = require('../config/main')
const expressDeliver = require('express-deliver')
const mongoose = require('mongoose')

const reactionTime = 3000

let players = {
    0: 2,
}

let cardsByPlayer = {
    0: 5,
}

let newState

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
        players: new Array(players[type]),
        cardsByPlayer: cardsByPlayer[type]
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
// PUSH CARD
//========================================
exports.pushCard = function*(req, res) {
    let gameId = req.body.gameId
    let card = req.body.card
    let userId = req.user._id

    let game = yield Game.findOne({ _id: gameId })
    if(!game)
        throw new res.exception.UnknowGame()

    let popGame = yield User.populate(game, {path: "players"})
    if(!popGame)
        throw new res.exception.CantPopulateUsers()

    //check if this player can push a card
    let activePlayerId = game.players[game.activePlayer]._id
    if(userId.toString() === activePlayerId.toString()) {
        game.playersCards[game.activePlayer].pushedCard = card

        game.playersCards[game.activePlayer].cards = game.playersCards[game.activePlayer].cards
            .filter(item => !compareCard(item, card))

    } else {
        throw new res.exception.YouCantPlayNow()
    }
    game.markModified('playersCards')
    let all = allPushed(game.playersCards)
    //check if round is finish to set next active
    if(!all) {
        game.activePlayer = nextPlayer(game.activePlayer,game.playersCards)
    } else {
        game.activePlayer=-1
    }

    let saved = yield game.save()
    if(!saved)
        throw new res.exception.ErrorUpdating()

    global.io.emit('gameupdated', { game: game })

    //check if round is finish to collect cards and emit a new update event
    if(all) {
        console.log('round finished')
        //stop the game interactions
        game.activePlayer=-1
        game = finishRound(game)
        game.markModified('playersCards')
        let saved = yield game.save()
        if(!saved)
            throw new res.exception.ErrorUpdating()

        setTimeout(()=>{
            global.io.emit('gameupdated', { game: game })
        }, reactionTime)

    }

    return {
        // gameId:gameId,
        // card:card,
        // userId: userId
    }
}
//========================================
// SET PLAYER IN A GAME
//========================================
exports.setPlayer = function*(req, res) {
    let gameId = req.body.gameId
    let position = req.body.position
    let userId = req.user._id

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
        //create desk and deal cards
        game.desk = new Desk()
        game = dealCards(game, 4)
        game.activePlayer = 0
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

function dealCards(game, total) {
    if(game && game.desk && game.players)
        console.log('ready to deal')
        
    game.playersCards = game.players.map( (item, index) =>  createPlayerCards(item._id, takeCards(game.desk, index*total, total)))
    game.desk = game.desk.filter( (item,index)=> index>game.playersCards.length*total)
    return game
}

function takeCards(desk, init, total) {
    return desk.filter( (item, index) => index >= init && index < total + init )
}

function createPlayerCards(uid, cards) {
    return {
        id: uid,
        cards:cards
    }
}

function allPushed(players) {
    return players.filter(item => item.pushedCard.type==='Empty').length<1
}

function nextPlayer(active,players) {
    return active < players.length-1 ? ++active : 0
}

function compareCard(item, card) {
    return item.number === card.number && item.type === card.type
}

function checkWinner(players) {
    let values = players.map((item)=> item.pushedCard.number)
    return values.indexOf(Math.max.apply(null, values))
}

function collectCards(players, winner) {
    let roundCards = players.map(item => item.pushedCard)
    console.log('roundCards', roundCards)
    players[winner].collectedCards = players[winner].collectedCards.concat(roundCards)
    console.log('collectedCards', players[winner].collectedCards)
    players = players.map(item => clearPushed(item) )
    console.log('round finished', players)
    return players
}
function clearPushed(item) {
    item.pushedCard.type='Empty'
    return item
}

function finishRound(game) {
    console.log('new round')
    //check who win the round
    let winner = checkWinner(game.playersCards)
    game.playersCards = collectCards(game.playersCards, winner)
    game.activePlayer = winner
    return game
}





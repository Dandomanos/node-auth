
const Game = require('../models/game')
const User = require('../models/user')
const config = require('../config/main')
const expressDeliver = require('express-deliver')
const mongoose = require('mongoose')

const io = require('../socketEvents').get()
console.log(io)

const reactionTime = 1500

let players = {
    0: 2,
}

let cardsByPlayer = {
    0: 30,
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
    
    io.emit('updated', { games: games })

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
    
    io.emit('updated', { games: games })
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

    //check if it is the first card on the round
    let mandatory = checkMandatory(game.playersCards)
    if(mandatory) {
        console.log('mandatoryCard')
        game.mandatoryCard = card
    }

    game.markModified('playersCards')
    
    //check if round is finish to set next active
    let all = allPushed(game.playersCards)
    if(!all) {
        game.activePlayer = nextPlayer(game.activePlayer,game.playersCards)
    } else {
        game.activePlayer=-1
    }

    let saved = yield game.save()
    if(!saved)
        throw new res.exception.ErrorUpdating()

    game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))

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
            game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))
        }, reactionTime)

        //check if game is finished
        let finished = isFinished(game.playersCards)
        if(finished) {
            game.state = 2
            console.log('finished game')

            //Add final 10
            game.playersCards[game.activePlayer].extraPoints.push({value:10, type:'Monte'})
            let extraPoints = new Array(2)
            extraPoints[0] = game.playersCards[0].extraPoints.map(item=>item.value)
                .reduce((prev,cur) => prev + cur, 0)
            extraPoints[1] = game.playersCards[1].extraPoints.map(item=>item.value)
                .reduce((prev,cur) => prev + cur, 0)

            console.log('extraPoints',extraPoints)

            let score = new Array(2)
            score[0] = game.playersCards[0].collectedCards.map(item=>getValue(item.number))
            score[1] = game.playersCards[1].collectedCards.map(item=>getValue(item.number))
            console.log('Score',score)

            score[0] = score[0].reduce((prev,cur) => prev + cur, 0) + extraPoints[0]
            score[1] = score[1].reduce((prev,cur) => prev + cur, 0) + extraPoints[1]
            console.log('Score',score)
            game.score.matchs.push(score)

            let maxValue = Math.max(...score)
            let index = score.indexOf(maxValue)
            let points = maxValue >= 102 ? 2 : 1

            let newScore = [0,0]          
            newScore[index] = points
            game.score.total = game.score.total.map((item, index) => item + newScore[index])


            game.markModified('score')

            let saved = yield game.save()
            if(!saved)
                throw new res.exception.ErrorUpdating()

            setTimeout(()=>{
                game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))
            }, reactionTime*1.5)
        
        }

    }

    return { }
}

//========================================
// SET PLAYER IN A GAME
//========================================
exports.setPlayer = function*(req, res) {
    let gameId = req.body.gameId
    let position = req.body.position
    let socketId = req.body.socketId
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
    game.socketIds[position] = socketId
    game.markModified('socketIds')
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
    
    io.emit('updated', { games: games })

    let gamePopulated = yield User.populate(game, {path: "players"})
    if(!gamePopulated)
        throw new res.exception.CantPopulateUsers()

    //check if game should start
    if(game.state===0 && gameFull(game.players)) {
        game.state=1
        //create desk and deal cards
        game.desk = new Desk()
        console.log('game.type', game.type)
        game = dealCards(game, cardsByPlayer[game.type])
        game.activePlayer = 0
        game.markModified('desk')
        let gameSaved = yield game.save()
        if(!gameSaved)
            throw new res.exception.ErrorUpdating()

        //emit by id

    }

    //emit by id
    game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))

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
    let gameId = req.body.gameId
    let socketId = req.body.socketId
    let userId = req.user._id

    //check if the place is free
    let game = yield Game.findOne({ _id: gameId })
    if(!game)
        throw new res.exception.UnknowGame()

    let popGame = yield User.populate(game, {path: "players"})
    if(!popGame)
        throw new res.exception.CantPopulateUsers()

    let position = game.players.map(item=>item._id.toString()).indexOf(userId.toString())
    if(position==-1)
         throw new res.exception.YouAreNotInTheGame()
    
    game.socketIds[position] = socketId
    game.markModified('socketIds')
    
    let saved = yield game.save()
    if(!saved)
        throw new res.exception.ErrorUpdating()

    game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))

    return {
            
    }
}

//========================================
// SET SING EXTRA POINTS ON THE GAME
//========================================
exports.setExtraPoints = function*(req, res) {
    let gameId = req.body.gameId
    let extraPoint = req.body.extraPoint
    let userId = req.user._id

    if(!extraPoint)
        throw new res.exception.UnknowParams()

    let game = yield Game.findOne({ _id: gameId })
    if(!game)
        throw new res.exception.UnknowGame()

    let popGame = yield User.populate(game, {path: "players"})
    if(!popGame)
        throw new res.exception.CantPopulateUsers()

    let position = game.players.map(item=>item._id.toString()).indexOf(userId.toString())
    if(position==-1)
         throw new res.exception.YouAreNotInTheGame()

    let canSingIndex = game.playersCards[position].canSing.map(item=> item.type).indexOf(extraPoint.type)
    if(canSingIndex==-1)
        throw new res.exception.YouCantSing()

    game.playersCards[position].extraPoints.push(extraPoint)

    //check Tute
    if(extraPoint.type === 'Tute') {
        console.log('Tute, you should finish the game')

        // remove extraPoints buttons
        game.playersCards[position].canSing = new Array()
        game.activePlayer=-1
        game.markModified('playersCards')
        let saved = yield game.save()
        if(!saved)
            throw new res.exception.ErrorUpdating()

        game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))

        //Finish game and add score
        game.state = 2
        let score = new Array(2)
        score = [0,0]
        score[position] = 102

        game.score.matchs.push(score)

        let maxValue = Math.max(...score)
        let index = score.indexOf(maxValue)
        let points = maxValue >= 102 ? 2 : 1

        let newScore = [0,0]          
        newScore[index] = points
        game.score.total = game.score.total.map((item, index) => item + newScore[index])

        game.playersCards = game.playersCards.map(item => clearCollected(item))
        game.markModified('playersCards')
        game.markModified('score')

        let againSaved = yield game.save()
        if(!againSaved)
            throw new res.exception.ErrorUpdating()

        setTimeout(()=>{
            game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))
        }, reactionTime*1.5)

        return {}
        
        
    }

    
    game.playersCards[position].canSing = new Array()
    game.markModified('playersCards')
    
    let saved = yield game.save()
    if(!saved)
        throw new res.exception.ErrorUpdating()

    game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))

    return {
            
    }
}


//========================================
// SET READY PLAYER IN A GAME
//========================================
exports.setReady = function*(req, res) {
    let gameId = req.body.gameId
    let userId = req.user._id

    //check if the place is free
    let game = yield Game.findOne({ _id: gameId })
    if(!game)
        throw new res.exception.UnknowGame()

    let popGame = yield User.populate(game, {path: "players"})
    if(!popGame)
        throw new res.exception.CantPopulateUsers()

    let playersId = game.players.map(item => item._id)
    let index = game.players.map(item => item._id.toString()).indexOf(userId.toString())
    game.readyPlayers[index] = 1

    game.markModified('readyPlayers')
    let allConfirmed = game.readyPlayers.reduce((prev,cur)=>prev+cur,0) >= game.players.length

    if(allConfirmed)
        game = nextRound(game)

    let saved = yield game.save()
    if(!saved)
        throw new res.exception.ErrorUpdating()

    game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))

    return { }
}

//========================================
// AUXILIAR FUNCTIONS
//========================================

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
    game.triumphCard = game.desk[game.desk.length-1]    
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

function checkMandatory(players) {
    return players.filter(item => item.pushedCard.type==='Empty').length==players.length-1
}

function nextPlayer(active,players) {
    return active < players.length-1 ? ++active : 0
}

function compareCard(item, card) {
    return item.number === card.number && item.type === card.type
}

function checkWinner(players,triumph,mandatory) {

    let winnerCard
    let pushedCards = players.map((item)=> item.pushedCard)
    let triumphs = pushedCards.filter(item =>item.type===triumph.type)
    let sameType = pushedCards.filter(item =>item.type===mandatory.type)

    if(triumphs.length>0)
        winnerCard = sortCards(triumphs)[0]
    else
        winnerCard = sortCards(sameType)[0]

    let position = pushedCards.indexOf(winnerCard)
    return position
}

function getValue(number) {
    switch(number)
    {
        case 1:
            return 11
        case 3:
            return 10
        case 12:
            return 4
        case 11:
            return 3
        case 10:
            return 2
        default:
            return 0
    }
}

function sortCards(cards) {
    let byNumber = cards.sort((a,b) =>  b.number - a.number )
    let sorted = new Array()
    sorted[0] = byNumber.filter(item => item.number === 1)
    sorted[1] = byNumber.filter(item => item.number === 3)
    sorted[2] = byNumber.filter(item => item.number !== 3 && item.number !== 1)

    return sorted.reduce((prev, cur) => prev.concat(cur), [])
}

function collectCards(players, winner) {
    let roundCards = players.map(item => item.pushedCard)
    players[winner].collectedCards = players[winner].collectedCards.concat(roundCards)
    players = players.map(item => clearPushed(item) )
    return players
}
function clearPushed(item) {
    item.pushedCard.type='Empty'
    return item
}

function finishRound(game) {
    //check who win the round
    let winner = checkWinner(game.playersCards, game.triumphCard, game.mandatoryCard)
    game.playersCards = collectCards(game.playersCards, winner)
    game.activePlayer = winner

    //check Winner extraPoints
    game.playersCards = checkExtraPoints(game.playersCards, winner, game.triumphCard.type)
    game.mandatoryCard = {}
    return game
}

function isFinished(players) {
    let cards = players.map(item => item.cards.map(item=>item))
        .reduce((prev, cur) => prev + cur.length, 0)
    console.log('cards to finish ',cards)
    return cards === 0
}

function getSongObj(type, triumph) {
    return { type:type, value: triumph===type ? 40 : 20 }
}

function checkExtraPoints(players,position, triumphType) {
    let cards = players[position].cards.map( item=>item )
    let types = ['Oros','Copas','Espadas','Bastos']
    let numbers = [12, 11]

    // check Tute
    let tute = numbers.map(item => cards.filter(card => card.number === item))
    let tuteObj = tute.filter(item => item.length>=4)

    if(tuteObj.length>=1) {
        console.log('can sing Tute on ', tuteObj[0][0].number )
        let canSing = new Array()
        canSing.push({ type: 'Tute', value:102, number:tuteObj[0][0].number})
        players[position].canSing = canSing
        return players
    }


    // check Sings
    let alreadySinged = players[position].extraPoints.map(item => item.type)

    let extraTypes = types.map(item => cards.filter(card => card.type === item))
                          .map(item => item.filter(card => card.number === 12 || card.number === 11))
                          .filter(item => item.length>1)
                          .map(item => item[0].type )
                          .filter( item => alreadySinged.indexOf(item) === -1 )

    console.log('extraTypes',extraTypes)
    
    let canSing = extraTypes.map(item => getSongObj(item, triumphType) )
    let can40 = canSing.filter(item => item.type===triumphType)
    if(can40.length>=1)
        canSing = can40

    players[position].canSing = canSing

    return players
}

function nextRound(game) {
    game.readyPlayers = game.players.map(item=>0)
    game.desk = new Desk()
    game = dealCards(game, cardsByPlayer[game.type])
    
    game.lastActive = game.lastActive + 1
    if(game.lastActive>=game.players.length)
        game.lastActive = 0

    game.activePlayer = game.lastActive

    game.state = 1

    game.markModified('desk')
    console.log('game.readyPlayers',game.readyPlayers)
    return game
}

function hideCards(player) {
    player.cards = player.cards.map( item => { item.type = 'Empty', item.number=0 } )
    return player
}

function clearCollected(item) {
    if(item && item.collectedCards)
        item.collectedCards = new Array()

    return item
}



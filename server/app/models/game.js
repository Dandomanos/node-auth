const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const Game = require('./game')
const exception = require('../exceptions')
const debug = require('debug')('GAME MODEL => ')
const Desk = require('../controllers/game/Desk')
const Cards = require('../controllers/game/Cards')
debug.enabled = true
//================================
// Game Schema
//================================
// states: 0 => created, 1 => playing, 2=> scoring 3=>finished
// types: 0 => Tute

const GameSchema = new Schema({
    type: {
        type: Number,
        enum: [0],
        default: 0
    },
    players: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    socketIds: {
        type:Array,
        default:['','']
    },
    readyPlayers: {
        type: Array,
        default:[0,0]
    },
    state: {
        type: Number,
        enum:[0,1,2],
        default:0
    },
    desk:[{
        type: {
            type:String,
            enum: Cards.types,
            default: 'Oros'
        },
        number: {
            type: Number,
            enum: Cards.numbers,
            default:1
        }
    }],
    triumphCard:{
        type: {
            type:String,
            enum: Cards.typesEmpty,
            default: 'Empty'
        },
        number: {
            type: Number,
            enum: Cards.numbersEmpty,
            default:0
        },
        default:{}
    },
    mandatoryCard:{
        type: {
            type:String,
            enum: Cards.typesEmpty,
            default: 'Empty'
        },
        number: {
            type: Number,
            enum: Cards.numbersEmpty,
            default:0
        },
        default:{}
    },
    playersCards:[{
        id: { type: String},
        cards: [{
            type: {
                type:String,
                enum: Cards.types,
                default: 'Oros'
            },
            number: {
                type: Number,
                enum: Cards.numbers,
                default:1
            }
        }],
        pushedCard: {
            type: {
                type:String,
                enum: Cards.typesEmpty,
                default: 'Empty'
            },
            number: {
                type: Number,
                enum: Cards.numbersEmpty,
                default:0
            },
            default:{}
        },
        collectedCards: [{
            type: {
                type:String,
                enum: Cards.types,
                default: 'Oros'
            },
            number: {
                type: Number,
                enum: Cards.numbers,
                default:1
            }
        }],
        extraPoints: [{
            type: {
                type:String,
                enum: Cards.typesExtra,
                // default: 'Oros'
            },
            value: {
                type: Number,
                enum: Cards.valuesExtra,
                // default:1
            },
            number: {
                type: Number,
                enum: Cards.numbersExtra
            }
        }],
        canSing: [{
            type: {
                type:String,
                enum: Cards.typesSong,
                // default: 'Oros'
            },
            value: {
                type: Number,
                enum: Cards.valuesSong,
                // default:1
            },
            number: {
                type: Number,
                enum: Cards.numbersExtra,
            }
        }],
    }],
    cardsByPlayer: {
        type: Number,
        default:10
    },
    activePlayer:{
        type: Number,
        default: -1
    },
    lastActive:{
        type: Number,
        default: 0
    },
    score: {
        total: {
            type:Array,
            default:[0,0]
        },
        matchs:[{

        }],
    }
})

let players = {
    0: 2,
}

let cardsByPlayer = {
    0: 20,
}

const phantomId = '595b701b07770e46038c5877'

GameSchema.methods.createGame = function (type) {
    this.type = type
    this.players = new Array(players[type])
    this.cardsByPlayer = cardsByPlayer[type]
    this.players = this.players.map(()=>mongoose.Types.ObjectId(phantomId))
}

GameSchema.methods.checkMandatory = function(card) {
    if(this.playersCards.filter(item => item.pushedCard.type==='Empty').length==this.playersCards.length-1)
        this.mandatoryCard = card
}

GameSchema.methods.pushCard = function* (uid, card) {
    let activePlayerId = this.players[this.activePlayer]._id
    if(uid.toString() === activePlayerId.toString()) {
        this.playersCards[this.activePlayer].pushedCard = card

        this.playersCards[this.activePlayer].cards = this.playersCards[this.activePlayer].cards
            .filter(item => !compareCard(item, card))

    } else {
        throw new exception.YouCantPlayNow()
    }

    this.checkMandatory(card)


    let all = this.allPushed()
    if(!all) {
        this.activePlayer = nextPlayer(this.activePlayer,this.playersCards)
    } else {
        this.activePlayer=-1
    }
    this.markModified('playersCards')

}

GameSchema.methods.allPushed = function() {
    return this.playersCards && this.playersCards.filter(item => item.pushedCard.type==='Empty').length<1
}

GameSchema.methods.finishRound = function() {
    let winner = this.checkWinner()
    this.collectCards(winner)
    this.checkExtraPoints(winner)
}

GameSchema.methods.checkExtraPoints = function(position) {
    let cards = this.playersCards[position].cards.map( item=>item )

    // check Tute
    let tute = Cards.numbersExtra.map(item => cards.filter(card => card.number === item))
    let tuteObj = tute.filter(item => item.length>=4)

    if(tuteObj.length>=1) {
        let canSing = new Array()
        canSing.push({ type: 'Tute', value:102, number:tuteObj[0][0].number})
        this.playersCards[position].canSing = canSing
        this.markModified('playersCards')
        return
    }

    // check Sings
    let alreadySinged = this.playersCards[position].extraPoints.map(item => item.type)

    let extraTypes = Cards.types.map(item => cards.filter(card => card.type === item))
                          .map(item => item.filter(card => card.number === 12 || card.number === 11))
                          .filter(item => item.length>1)
                          .map(item => item[0].type )
                          .filter( item => alreadySinged.indexOf(item) === -1 )
    
    let canSing = extraTypes.map(item => getSongObj(item, this.triumphCard.type) )
    let can40 = canSing.filter(item => item.type===this.triumphCard.type)
    if(can40.length>=1)
        canSing = can40

    this.playersCards[position].canSing = canSing

    this.mandatoryCard = {}
    this.markModified('playersCards')

}

GameSchema.methods.checkWinner = function() {
    let winnerCard
    let pushedCards = this.playersCards.map((item)=> item.pushedCard)
    let triumphs = pushedCards.filter(item =>item.type===this.triumphCard.type)
    let sameType = pushedCards.filter(item =>item.type===this.mandatoryCard.type)

    if(triumphs.length>0)
        winnerCard = sortCards(triumphs)[0]
    else
        winnerCard = sortCards(sameType)[0]

    let position = pushedCards.indexOf(winnerCard)
    return position
}

GameSchema.methods.collectCards = function(winner) {
    let roundCards = this.playersCards.map(item => item.pushedCard)
    this.playersCards[winner].collectedCards = this.playersCards[winner].collectedCards.concat(roundCards)
    this.playersCards = this.playersCards.map(item => clearPushed(item) )
    this.activePlayer = winner
}
GameSchema.methods.isFinished = function() {
    let cards = this.playersCards.map(item => item.cards.map(item=>item))
        .reduce((prev, cur) => prev + cur.length, 0)
    return cards === 0
}

GameSchema.methods.finishMatch = function() {
    this.state = 2

    //Add final 10
    this.playersCards[this.activePlayer].extraPoints.push({value:10, type:'Monte'})
    let extraPoints = [[],[]]
    extraPoints = extraPoints.map((item, index) => this.playersCards[index].extraPoints.map(card=>card.value).reduce((prev,cur) => prev + cur, 0))

    let score = [[],[]]
    score = score.map((item, index) => this.playersCards[index].collectedCards.map(card=>getValue(card.number)).reduce((prev,cur) => prev + cur, 0) + extraPoints[index])

    this.addScore(score)
}

GameSchema.methods.addScore = function(score) {
    this.score.matchs.push(score)

    let maxValue = Math.max(...score)
    let index = score.indexOf(maxValue)
    let points = maxValue >= 102 ? 2 : 1

    let newScore = [0,0]          
    newScore[index] = points
    this.score.total = this.score.total.map((item, index) => item + newScore[index])
    this.markModified('score')
}

GameSchema.methods.setPlayer = function(req) {
    let gameId = req.body.gameId
    let position = req.body.position
    let socketId = req.body.socketId
    let userId = req.user._id

    if(this.players[position].role!=='Phantom')
        throw new exception.Occupied()

    this.players[position] = userId
    this.socketIds[position] = socketId

    this.markModified('socketIds')
    this.markModified('players')
}
GameSchema.methods.isReady = function() {
    return this.isFull() && this.state === 0
}
GameSchema.methods.isFull = function() {
    return this.players ? this.players.filter( item => item.role === 'Phantom' ).length <= 0 : false    
}
GameSchema.methods.startNewGame = function() {
    this.state=1
    this.desk = new Desk()
    // this = dealCards(this, cardsByPlayer[this.type])
    this.dealCards()
    this.activePlayer = 0
    this.markModified('desk')
}
GameSchema.methods.dealCards = function() {
    let total = cardsByPlayer[this.type]
    this.triumphCard = this.desk[this.desk.length-1]    
    this.playersCards = this.players.map( (item, index) =>  createPlayerCards(item._id, takeCards(this.desk, index*total, total)))
    this.desk = this.desk.filter( (item,index)=> index>this.playersCards.length*total)
}
GameSchema.methods.setSocketId = function(req) {
    let socketId = req.body.socketId
    let userId = req.user._id
    let position = this.checkPosition(userId)

    this.socketIds[position] = socketId
    this.markModified('socketIds')
}
GameSchema.methods.clearSings = function(req) {
    let userId = req.user._id
    let position = this.checkPosition(userId)
    this.playersCards[position].canSing = new Array()
    this.activePlayer=-1
    this.markModified('playersCards')
}
GameSchema.methods.singTute = function(req) {
    // this.clearSings(req)
    let userId = req.user._id
    let position = this.checkPosition(userId)
    this.state = 2
    let score = [0,0]
    score[position] = 102
    this.addScore(score)
    this.clearCollected()
}
GameSchema.methods.clearCollected = function(req) {
    this.playersCards = this.playersCards.map(item => clearCollectedCards(item))
}
GameSchema.methods.addScore = function(score) {
    this.score.matchs.push(score)

    let maxValue = Math.max(...score)
    let index = score.indexOf(maxValue)
    let points = maxValue >= 102 ? 2 : 1

    let newScore = [0,0]          
    newScore[index] = points
    this.score.total = this.score.total.map((item, index) => item + newScore[index])
    this.markModified('score')
}
GameSchema.methods.setExtraPoints = function(req) {
    let extraPoint = req.body.extraPoint
    let userId = req.user._id
    if(!extraPoint || !userId)
        throw new exception.UnknowParams()

    let position = this.checkPosition(userId)
    let canSingIndex = this.playersCards[position].canSing.map(item=> item.type).indexOf(extraPoint.type)
    if(canSingIndex==-1)
        throw new exception.YouCantSing()

    this.playersCards[position].extraPoints.push(extraPoint)
    this.clearSings(req)
    if(extraPoint.type !== 'Tute')
        this.activePlayer = position
}
GameSchema.methods.checkPosition = function(uid) {
    let position = this.players.map(item=>item._id.toString()).indexOf(uid.toString())
    if(position==-1)
         throw new exception.YouAreNotInTheGame()
    return position
}
GameSchema.methods.setReady = function(uid) {
    let playersId = this.players.map(item => item._id)
    let index = this.players.map(item => item._id.toString()).indexOf(uid.toString())
    this.readyPlayers[index] = 1

    this.markModified('readyPlayers')
    let allConfirmed = this.readyPlayers.reduce((prev,cur)=>prev+cur,0) >= this.players.length

    if(allConfirmed)
        this.nextRound()
}
GameSchema.methods.nextRound = function() {
    this.readyPlayers = this.players.map(item=>0)
    this.desk = new Desk()
    this.dealCards()
    
    this.lastActive = this.lastActive + 1
    if(this.lastActive>=this.players.length)
        this.lastActive = 0

    this.activePlayer = this.lastActive
    this.state = 1

    this.markModified('desk')
}

/* Auxiliar functions */

function compareCard(item, card) {
    return item.number === card.number && item.type === card.type
}
function nextPlayer(active,players) {
    return active < players.length-1 ? ++active : 0
}
function sortCards(cards) {
    let byNumber = cards.sort((a,b) =>  b.number - a.number )
    let sorted = new Array()
    sorted[0] = byNumber.filter(item => item.number === 1)
    sorted[1] = byNumber.filter(item => item.number === 3)
    sorted[2] = byNumber.filter(item => item.number !== 3 && item.number !== 1)

    return sorted.reduce((prev, cur) => prev.concat(cur), [])
}
function clearPushed(item) {
    item.pushedCard.type='Empty'
    return item
}
function getSongObj(type, triumph) {
    return { type:type, value: triumph===type ? 40 : 20 }
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

function createPlayerCards(uid, cards) {
    return {
        id: uid,
        cards:cards
    }
}

function takeCards(desk, init, total) {
    return desk.filter( (item, index) => index >= init && index < total + init )
}

function clearCollectedCards(item) {
    if(item && item.collectedCards)
        item.collectedCards = new Array()

    return item
}

module.exports = mongoose.model('Game0', GameSchema)
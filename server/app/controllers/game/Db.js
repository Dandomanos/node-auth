const Game = require('../../models/game')
const User = require('../../models/user')
const config = require('../../config/main')
const expressDeliver = require('express-deliver')
const mongoose = require('mongoose')
const exception = require('../../exceptions')

const io = require('../../socketEvents').get()
// console.log(io)
const debug = require('debug')('DB =>')
debug.enabled= true

class Db {
    constructor(){

    }
    *getGames (req){
        let query = getQuery(req.url)
        if(query.game) {
            let game = yield Game.findOne( { _id: query.game} )
            if(!game)
                throw new exception.UnknowGame()

            let gamePopulated = yield User.populate(game, {path: "players"})
            if(!gamePopulated)
                throw new exception.CantPopulateUsers()

            return { game: game }
        }

        let games = yield Game.find( {} )
        if(!games)
            throw new exception.NoGamesCreated()

        let populated = yield User.populate(games, {path: "players"})
        if(!populated)
            throw new exception.CantPopulateUsers()

        return {
                games:games
        }
    }

    *getGame(id) {
        let game = yield Game.findOne({ _id: id })
        if(!game)
            throw new exception.UnknowGame()

        let popGame = yield User.populate(game, {path: "players"})
        if(!popGame)
            throw new exception.CantPopulateUsers()

        return game
    }

    *saveGame(game) {
        debug('saving game')
        let saved = yield game.save()
        if(!saved)
            throw new exception.CreateGameFailed()
    }

    *deleteGame(gameId) {
        debug('deleting game with id ', gameId)
        let deletedGame = yield Game.findOneAndRemove({_id:gameId})
        if(!deletedGame)
            throw new exception.DeleteGameFailed()
    }

}

function getQuery(path) {
    let url = require('url')
    let url_parts = url.parse(path, true)
    let query = url_parts.query
    return query
}

module.exports = Db
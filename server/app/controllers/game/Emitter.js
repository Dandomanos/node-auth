const io = require('../../socketEvents').get()

class Emitter {
    constructor(){

    }
    emitAll(games) {
        io.emit('updated', games)
    }
    emitPlayers(game, delay) {
        if(!delay)
            game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))
        else{
            setTimeout(()=>{
                game.socketIds.map(item => io.to(item).emit('gameupdated', { game: game }))
            }, delay)
        }
    }

}

module.exports = Emitter
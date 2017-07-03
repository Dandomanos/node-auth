const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs')

//================================
// User Schema
//================================

// types: 0 => Carta más alta
const Game0Schema = new Schema({
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
    playersLength: {
        type: Number,
        enum:[2],
        default:2
    }
})

module.exports = mongoose.model('Game0', Game0Schema)
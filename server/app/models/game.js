const mongoose = require('mongoose'),
    Schema = mongoose.Schema

//================================
// Game Schema
//================================
// states: 0 => created, 1 => playing, 2=> finished
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
    state: {
        type: Number,
        enum:[0,1,2],
        default:0
    },
    desk:[{
        type: {
            type:String,
            enum: ['Oros','Copas', 'Espadas', 'Bastos'],
            default: 'Oros'
        },
        number: {
            type: Number,
            enum: [1,2,3,4,5,6,7,10,11,12],
            default:1
        }
    }],
    playersCards:[{
        id: { type: String},
        cards: [{
            type: {
                type:String,
                enum: ['Oros','Copas', 'Espadas', 'Bastos'],
                default: 'Oros'
            },
            number: {
                type: Number,
                enum: [1,2,3,4,5,6,7,10,11,12],
                default:1
            }
        }]
    }],
    cardsByPlayer: {
        type: Number,
        default:10
    }
})

module.exports = mongoose.model('Game0', Game0Schema)
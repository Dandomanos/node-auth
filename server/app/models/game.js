const mongoose = require('mongoose'),
    Schema = mongoose.Schema

//================================
// Game Schema
//================================
// states: 0 => created, 1 => playing, 2=> scoring 3=>finished
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
            enum: ['Oros','Copas', 'Espadas', 'Bastos'],
            default: 'Oros'
        },
        number: {
            type: Number,
            enum: [1,2,3,4,5,6,7,10,11,12],
            default:1
        }
    }],
    triumphCard:{
        type: {
            type:String,
            enum: ['Oros','Copas', 'Espadas', 'Bastos', 'Empty'],
            default: 'Empty'
        },
        number: {
            type: Number,
            enum: [0,1,2,3,4,5,6,7,10,11,12],
            default:0
        },
        default:{}
    },
    mandatoryCard:{
        type: {
            type:String,
            enum: ['Oros','Copas', 'Espadas', 'Bastos', 'Empty'],
            default: 'Empty'
        },
        number: {
            type: Number,
            enum: [0,1,2,3,4,5,6,7,10,11,12],
            default:0
        },
        default:{}
    },
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
        }],
        pushedCard: {
            type: {
                type:String,
                enum: ['Oros','Copas', 'Espadas', 'Bastos', 'Empty'],
                default: 'Empty'
            },
            number: {
                type: Number,
                enum: [0,1,2,3,4,5,6,7,10,11,12],
                default:0
            },
            default:{}
        },
        collectedCards: [{
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
        extraPoints: [{
            type: {
                type:String,
                enum: ['Monte','Oros','Copas', 'Espadas', 'Bastos'],
                // default: 'Oros'
            },
            value: {
                type: Number,
                enum: [10,20,40],
                // default:1
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

module.exports = mongoose.model('Game0', Game0Schema)
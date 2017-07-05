const mongoose = require('mongoose'),
    Schema = mongoose.Schema

//================================
// Card Schema
//================================

const Card = new Schema({
    type: {
        type: String,
        enum: ['Oros','Copas', 'Espadas', 'Bastos'],
        default: 'Oros'
    },
    number: {
        type: Number,
        enum: [1,2,3,4,5,6,7,10,11,12],
        default:1
    }
})

module.exports = mongoose.model('Card', Card)
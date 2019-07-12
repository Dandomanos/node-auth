const Cards = require('./Cards')
class Desk {
    constructor(){
        return this.createDesk()
    }
    createCard(number, type) {
        return {
            'number':number,
            'type':type
        }
    }
    createType(type) {
        return Cards.numbers.map((number)=> this.createCard(number, type))
    }
    createDesk() {
        return Cards.types.map((type)=>this.createType(type)).reduce((prev, cur) => prev.concat(cur), []).sort(() => (Math.random() - 0.5))
    }
}
module.exports = Desk
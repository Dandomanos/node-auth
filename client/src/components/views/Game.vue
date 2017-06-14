<template>
    <div class="gameContainer">
        <div class="toolbar">
            <button @click="createDesk()" class="primary-button is-toolbar">New Desk</button>
        </div>
        <div class="game">  
            <card v-for="card in desk" :type="card.type" :number="card.number" :key="card.number+card.type"></card>
        </div>
    </div>
</template>

<script>
// import anime from 'animejs'
import Card from '../commons/Card'
export default {
    name: 'Game',
    components: {
        Card,
    },
    data () {
        return {
            types:['Oros','Copas', 'Espadas', 'Bastos'],
            numbers: [1,2,3,4,5,6,7,10,11,12],
            desk:null
        }
    },
    methods: {
        createCard(number, type) {
            return {
                'number':number,
                'type':type
            }
        },
        createType(type) {
            return this.numbers.map((number)=> this.createCard(number, type))
        },
        createDesk() {
            this.desk = this.types.map((type)=>this.createType(type)).reduce((prev, cur) => prev.concat(cur), []).sort(() => (Math.random() - 0.5))
        }
    }
}
</script>

<style lang="scss">
.gameContainer {
    margin: 1rem auto;
    padding: 1rem;
}
.game {
    width:100%;
    max-width:50rem;
    margin:0 auto;
    height:50rem;
    border:1px solid #ccc;
    position:relative;
    .player {
        width:5rem;
        height:5rem;
        border:1px solid rgba(#ccc,0.5);
        position:absolute;
        &.player1 {
            top:0;
            background-color:red;
        }
        &.player2 {
            bottom:0;
            background-color:blue;
        }
    }
}
</style>

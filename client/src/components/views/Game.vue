<template>
    <div class="celm-gameContainer">
        <div class="celm-toolbar">
            <button @click="createDesk()" class="celm-button is-toolbar">New Desk</button>
        </div>
        <div class="celm-game">  
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
@import '../../assets/scss/_const.scss';
.celm-gameContainer {
    margin: $game-margin auto;
    padding: $game-margin;
}
.celm-game {
    width:100%;
    max-width:$game-max-width;
    margin:0 auto;
    height:$game-max-height;
    border:$game-border;
    position:relative;
}
</style>

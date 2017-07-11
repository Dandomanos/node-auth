<template>
    <div class="scoreCard--container">
        <card 
            v-for="card in scoreCards"
            :type="card.type"
            :number="card.number"
            :key="card.number+card.type"
            :length="scoreCards.length"
            :disabled="true"
        ></card>

    </div>
</template>

<script>
// const debug = require('debug')('scoreCard')
import Card from '../commons/Card'
export default {
    name: 'Score',
    props:['score'],
    data () {
        return {
            scoreCardsObj: {
                'Monte':[{number:10,type:'Monte'}],
                'Oros':[{number:12,type:'Oros'},{number:11,type:'Oros'}],
                'Copas':[{number:12,type:'Copas'},{number:11,type:'Copas'}],
                'Espadas':[{number:12,type:'Espadas'},{number:11,type:'Espadas'}],
                'Bastos':[{number:12,type:'Bastos'},{number:11,type:'Bastos'}],
            }
        }
    },
    computed: {
        scoreCards() {
            return this.score && this.scoreCardsObj[this.score.type]
        }
    },
    components: {
        Card
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';

</style>

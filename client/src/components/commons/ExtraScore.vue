<template>
    <div class="scoreCard--container">
        <card 
            v-for="card in scoreCards"
            :type="card.type"
            :number="card.number"
            :key="card.number+card.type"
            :length="scoreCards.length"
            :disabled="true"
            :isHidden="card.type==='Monte'"
        ></card>
    </div>
</template>

<script>
// const debug = require('debug')('scoreCard')
import Card from '../commons/Card'
export default {
    name: 'ExtraScore',
    props:['score'],
    data () {
        return {

        }
    },
    computed: {
        scoreCards() {
            return this.score && this.scoreCardsObj[this.score.type]
        },
        scoreCardsNumber() {
            return this.score.number || 12
        },
        scoreCardsObj() {
            return {
                'Monte':[{number:10,type:'Monte'}],
                'Oros':[{number:12,type:'Oros'},{number:11,type:'Oros'}],
                'Copas':[{number:12,type:'Copas'},{number:11,type:'Copas'}],
                'Espadas':[{number:12,type:'Espadas'},{number:11,type:'Espadas'}],
                'Bastos':[{number:12,type:'Bastos'},{number:11,type:'Bastos'}],
                'Tute': [{number:this.scoreCardsNumber,type:'Oros'},{number:this.scoreCardsNumber,type:'Copas'},{number:this.scoreCardsNumber,type:'Espadas'},{number:this.scoreCardsNumber,type:'Bastos'}]
            }
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

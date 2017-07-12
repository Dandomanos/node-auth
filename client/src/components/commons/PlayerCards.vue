<template>
    <div
        class="cards player-cards"
        
    >
        <h2>{{username}} Cards</h2>
        <div class="player-cards">
            <card
                v-for="card in player.cards"
                :type="card.type"
                :number="card.number"
                :key="card.number+card.type"
                :isHidden="!owner"
                :length="player.cards.length"
            ></card>
        </div>
        <div class="game-cards vs-cards">
            <div class="pushed-cards">
                <card
                    :type="player.pushedCard.type"
                    :number="player.pushedCard.number"
                    class="celm-pushedCard"
                    :disabled="true"
                ></card>
            </div>
            <div class="extraPoints columns is-mobile">
                <div class="column" v-for="extra in player.extraPoints">
                    {{extra.value}} en {{extra.type}}
                </div>
            </div>
            <div class="collected-cards">
                <card
                    v-for="card in player.collectedCards"
                    :key="card.number+card.type"
                    :isHidden="true"
                    :disabled="true"
                ></card>
            </div>
        </div>
    </div>
</template>

<script>
import Card from '../commons/Card'
export default {
    name: 'PlayerCards',
    props:['player','username', 'owner'],
    components: {
        Card
    },
    computed: {
        yourTurn() {
            return this.isYourTurn
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';

</style>



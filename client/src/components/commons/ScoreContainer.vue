<template>
    <div class="scoreContainer--container">
        <div class="total-score--container">
            <div class="total-score columns is-mobile is-head">
                <div class="player-cards column is-6" v-for="(score, index) in total">
                TEAM {{index}}
                </div>
            </div>
            <div class="total-score columns is-mobile">
                <div class="player-cards column is-6" v-for="(score, index) in total">
                {{score}}
                </div>
            </div>
        </div>
        <div class="player-cards" v-for="(player, index) in players">
            <div class="columns is-mobile">
                <h3 class="column player-score">Team {{index}}</h3>
                <div class="cards-container column is-8">
                    <card
                        v-for="card in player.collectedCards"
                        :type="card.type"
                        :number="card.number"
                        :key="card.number+card.type"
                        :length="player.collectedCards.length"
                        :disabled="true"
                    ></card>
                    <card
                        v-if="player.collectedCards.length<=0"
                        :type="'Empty'"
                        :number="0"
                        :disabled="true"
                    ></card>
                    <div class="extraPoints columns is-mobile">
                        <div class="column" v-for="extra in player.extraPoints">
                            {{extra.value}} en {{extra.type}}
                            <extra-score :score="extra">
                            </extra-score>
                        </div>
                    </div>
                </div>
                <div class="cards-score column">
                    {{matchs[matchs.length-1][index]}}
                </div>
            </div>
        </div>
        <button class="button celm-button" @click="nextRound" :disabled="ready">
            Next Round
        </button>
        <div v-if="ready">Waitting for the others players</div>
    </div>
</template>

<script>
const debug = require('debug')('scoreContainer')
import Card from './Card'
import ExtraScore from './ExtraScore'
import {mapActions} from 'vuex'
export default {
    name: 'ScoreContainer',
    props:['players','matchs','ready','total'],
    data () {
        return {
            
        }
    },
    computed: {

    },
    components: {
        Card,
        ExtraScore
    },
    methods: {
        ...mapActions({
            setReady: 'match/SET_READY'
        }),
        async nextRound() {
            // this.ready=true
            await this.setReady()
            debug('emitting')
            this.$emit('change')
            debug('emitted')
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';
.scoreContainer--container {
    button.button.celm-button{
        display:block;
        margin:2rem auto;
    }
    .player-cards {
        padding:0rem;
        border:$input-border;
        .cards-container {
            min-height:9rem;
            padding:1rem;
            margin: 0.75rem;
            border-left:$input-border;
            border-right:$input-border;
        }
        .columns {
            .column {
                &:first-child {
                    padding-right:0;
                }
                &:last-child{
                    padding-left:0;
                }
            }
        }
    }
    .total-score--container {
        margin:1rem auto;
    }
    .total-score {
        margin:0rem auto;
        .player-cards {
            border:$input-border;
            padding: 1rem;
        }
        &.is-head {
            background-color:$button-bg-color;
            color:$button-font-color;
            font-weight:bold;
        }
    }
    .player-score {
        align-self: center;
        font-weight:bold;
    }
    .cards-score {
        align-self:center;
        font-size:1.5rem;
        color:darken($primary-color, 10);
    }
}
</style>

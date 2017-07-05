<template>
    <div class="celm-room--container">
        <div class="celm-room--gameHeader">
            <h2>Game Room</h2>
            <h3>gameId: {{gameId}}</h3>
        </div>
        <template v-if="game && game.players && user">
            <div class="celm-room--gameContent" >
                <div
                    class="celm-gamePlayer"
                    v-for="(player, index) in game.players"
                    v-if="player._id !== user._id"
                    :class="{'is-phantom':player.role==='Phantom'}"
                >
                    <img src="../../../static/game/user.svg" alt="">
                    <template v-if="player.role==='Phantom'">
                        Player {{index+1}}
                    </template>
                    <template v-else>
                        {{player.username}}
                    </template>
                </div>
                <div class="celm-gameTable">
                    <div
                        class="cards player-cards"
                        v-if="game.playersCards && !areYours(player.id)"
                        v-for="(player, index) in game.playersCards"
                    >
                        <h2>{{getUsername(player.id)}} Cards</h2>
                        <card
                            v-for="card in player.cards"
                            :type="card.type"
                            :number="card.number"
                            :key="card.number+card.type"
                            :isHidden="true"
                            :length="player.cards.length"
                        ></card>
                    </div>
                    <div class="cards desk-cards" v-if="game.desk">
                     <h2>Desk Cards</h2>
                        <card
                            v-for="card in game.desk"
                            :type="card.type"
                            :number="card.number"
                            :key="card.number+card.type"
                            :isHidden="true"
                            :length="game.desk.length"
                        ></card>
                    </div>
                    <div
                        class="cards player-cards"
                        v-if="game.playersCards && areYours(player.id)"
                        v-for="(player, index) in game.playersCards"
                    >
                        <h2>{{getUsername(player.id)}} Cards</h2>
                        <card
                            v-for="card in player.cards"
                            :type="card.type"
                            :number="card.number"
                            :key="card.number+card.type"
                            :length="player.cards.length"
                        ></card>
                    </div>
                </div>
                <div class="celm-gamePlayer">
                    <img src="../../../static/game/user.svg" alt="">
                    {{user.username}}
                </div>
            </div>
            <div class="celm-room--gameFooter">
            </div>
        </template>
        <template v-else>
            No game founded
        </template>
    </div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
import Card from '../commons/Card'
const debug = require('debug')('GAME ROOM => ')
export default {
    name: 'Room',
    data () {
        return {
            gameId:''
        }
    },
    mounted(){
        this.gameId=this.$route.params.gameId
        this.getGame({gameId:this.gameId})
    },
    components: {
        Card
    },
    methods: {
        ...mapActions({
            getGame: 'match/GET_GAME'
        }),
        getUsername(id) {
            let user = this.game.players.filter(item => item._id===id)[0]
            debug('user', user)
            return user.username
        },
        areYours(id) {
            return id === this.user._id
        }
    },
    computed: {
        ...mapState({
            game: state => state.match.game,
            user: state => state.auth.user
        })
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';
.celm-room--container {
    width:100%;
    max-width:35rem;
    margin:0 auto;
    .celm-gamePlayer {
        max-width:12rem;
        margin:0 auto;
        img {
            max-width:10rem;
            max-height:10rem;
            display:block;
            margin:0 auto;
        }
        &.is-phantom {
            opacity:0.5;
        }
    }
    .celm-gameTable {
        border:$input-border;
        .desk-cards {
            .cardContainer {
                width: 1px;
                margin: 0;
                padding: 0;
                &:last-child {
                    width:$card-width;
                    max-width:$card-width!important;
                }
            }
        }
    }
}
</style>
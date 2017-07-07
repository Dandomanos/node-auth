<template>
    <div class="celm-room--container">
        <div class="celm-room--gameHeader">
            <div class="celm-dev-toolbar">
                <h2>Game Room</h2>
                <h3>gameId: {{gameId}}</h3>
                <div v-if="game">
                    activePlayer: {{game.activePlayer}}
                </div>
            </div>
        </div>
        <template v-if="game && game.players && user">
            <div class="celm-room--gameContent" >
                <div
                    class="celm-gamePlayer"
                    v-for="(player, index) in game.players"
                    v-if="player._id !== user._id"
                    :class="{'is-phantom':player.role==='Phantom', 'is-active':player._id===activePlayerId}"
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
                        <div class="player-cards">
                            <card
                                v-for="card in player.cards"
                                :type="card.type"
                                :number="card.number"
                                :key="card.number+card.type"
                                :isHidden="true"
                                :length="player.cards.length"
                                :disabled="true"
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
                    <div class="cards desk-cards" v-if="game.desk">
                     <h2>Desk Cards</h2>
                        <card
                            v-for="card in game.desk"
                            :type="card.type"
                            :number="card.number"
                            :key="card.number+card.type"
                            :isHidden="true"
                            :length="game.desk.length"
                            :disabled="true"
                        ></card>
                    </div>
                    <div class="cards triumphCard">
                        <card
                            v-if="game.triumphCard"
                            :type="game.triumphCard.type"
                            :number="game.triumphCard.number"
                            :disabled="true"
                        ></card>
                    </div>
                    <div
                        class="cards player-cards"
                        v-if="game.playersCards && areYours(player.id)"
                        v-for="(player, index) in game.playersCards"
                    >
                        <h2>{{getUsername(player.id)}} Cards</h2>

                        <div class="game-cards team-cards">
                            <div class="pushed-cards">
                                <card
                                    :type="player.pushedCard.type"
                                    :number="player.pushedCard.number"
                                    class="celm-pushedCard"
                                    :disabled="true"
                                ></card>
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
                        <div class="player-cards">
                            <card
                                v-for="card in orderedCards"
                                :type="card.type"
                                :number="card.number"
                                :key="card.number+card.type"
                                :length="player.cards.length"
                                :action="pushCard"
                                :disabled="!isYourTurn || loading"
                            ></card>
                        </div>
                    </div>
                </div>
                <div class="celm-gamePlayer" :class="{'is-active':user._id===activePlayerId}">
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
            gameId:'',
            types : ['Oros','Copas','Espadas','Bastos'],
            values: [1,3,0]
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
            getGame: 'match/GET_GAME',
            pushCard: 'match/PUSH_CARD'
        }),
        getUsername(id) {
            let user = this.game.players.filter(item => item._id===id)[0]
            debug('user', user)
            return user.username
        },
        areYours(id) {
            return id === this.user._id
        },
    },
    computed: {
        ...mapState({
            game: state => state.match.game,
            loading: state => state.match.fetchStatus === 'fetching',
            user: state => state.auth.user
        }),
        activePlayerId() {
            return this.game && this.game.players && this.game.players[this.game.activePlayer] && this.game.players[this.game.activePlayer]._id
        },
        isYourTurn() {
            return this.activePlayerId === this.user._id
        },
        playerCards() {
            return this.game && this.game.playersCards && this.game.playersCards.filter(item=>item.id === this.user._id)[0].cards
        },
        sortedCards() {
            let byNumber = this.playerCards.sort((a,b) =>  b.number - a.number )
            let sorted = new Array()
            sorted[0] = byNumber.filter(item => item.number === 1)
            sorted[1] = byNumber.filter(item => item.number === 3)
            sorted[2] = byNumber.filter(item => item.number !== 3 && item.number !== 1)

            sorted = sorted.reduce((prev, cur) => prev.concat(cur), [])
            return sorted
        },
        orderedCards() {
            return this.types.map((item) => this.sortedCards.filter(card => card.type === item))
                .reduce((prev, cur) => prev.concat(cur), [])
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';
.celm-room--container {
    width:100%;
    max-width:35rem;
    margin:0 auto;
    .celm-dev-toolbar {
        font-size:0.9rem;
    }
    .celm-gamePlayer {
        max-width:12rem;
        margin:0 auto;
        &.is-active {
            background-color:lighten($primary-color, 40);
            border:$input-border;
            border-color:darken($primary-color, 10);
        }
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
        .desk-cards, .collected-cards {
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
        .game-cards {
            position:relative;
            .collected-cards {
                position:absolute;
                top:0;
            }
            &.team-cards {
                .collected-cards {
                    right:0;
                }
            }
            &.vs-cards {
                .collected-cards {
                    left:0;
                }
            }
        }
        .player-cards {
            margin:0.5rem;
        }
        .celm-pushedCard {
            display:block;
            text-align:center;
            width:100%;
            padding: 0;
            background-color: transparent;
            margin:0 auto;
            .card {
                width:$card-width;
                margin:0.5rem auto;
                span {
                    display:none;
                }
            }
        }
    }
}
</style>
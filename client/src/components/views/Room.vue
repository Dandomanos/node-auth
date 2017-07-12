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
                <game-player
                    v-for="(player, index) in game.players"
                    v-if="player._id !== user._id"
                    :key="player._id"
                    :player="player"
                    :index="index"
                    :activeId="activePlayerId"
                >
                </game-player>

                <div class="celm-gameTable" v-if="game.state===0 || game.state===1">

                    <player-cards
                        v-if="game.playersCards && !areYours(player.id)"
                        v-for="player in game.playersCards"
                        :player="player"
                        :key="player._id"
                        :username="getUsername(player.id)"
                        :owner="areYours(player.id)"
                    >
                    </player-cards>

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
                    
                    <!--
                    <player-cards
                        v-if="game.playersCards && areYours(player.id)"
                        v-for="player in game.playersCards"
                        :player="player"
                        :username="getUsername(player.id)"
                        :owner="areYours(player.id)"
                        :allowed="allowedCards"
                        :yourTurn="isYourTurn"
                    >
                    </player-cards>
                    -->
                    
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
                        <div class="extraPoints columns is-mobile">
                            <div class="column" v-for="extra in player.extraPoints">
                                {{extra.value}} en {{extra.type}}
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
                                :allowed="allowedCards"
                                :yourTurn="isYourTurn"
                            ></card>
                        </div>
                    </div>
                    
                </div>
                <score-container
                    class="celm-score"
                    v-else-if="game.state===2"
                    :players="game.playersCards"
                    :matchs="game.score.matchs"
                    :total="game.score.total"
                    :ready="ready"
                    @change="isReady()"
                >
                </score-container>
                
                <game-player
                    :player="user"
                    :activeId="activePlayerId"
                >
                </game-player>
                {{socketId}}
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
import ExtraScore from '../commons/ExtraScore'
import ScoreContainer from '../commons/ScoreContainer'
import GamePlayer from '../commons/GamePlayer'
import PlayerCards from '../commons/PlayerCards'
const debug = require('debug')('GAME ROOM => ')
export default {
    name: 'Room',
    data () {
        return {
            gameId:'',
            types : ['Oros','Copas','Espadas','Bastos'],
            values: [1,3,0],
            ready:false
        }
    },
    mounted(){
        this.gameId=this.$route.params.gameId
        this.getGame({gameId:this.gameId})
    },
    sockets:{
        getid: function(id){
            debug('socket connected',id)
            this.setSocketId({socketId:id})
        }
    },
    components: {
        Card,
        ExtraScore,
        ScoreContainer,
        GamePlayer,
        PlayerCards
    },
    methods: {
        ...mapActions({
            getGame: 'match/GET_GAME',
            pushCard: 'match/PUSH_CARD',
            setReady: 'match/SET_READY',
            setSocketId: 'match/SET_SOCKET_ID',
        }),
        isReady() {
            debug('chatching event')
            this.ready=true
        },
        getUsername(id) {
            let user = this.game.players.filter(item => item._id===id)[0]
            debug('user', user)
            return user.username
        },
        areYours(id) {
            return id === this.user._id
        },
        sortCards(cards) {
            let byNumber = cards.sort((a,b) =>  b.number - a.number )
            let sorted = new Array()
            sorted[0] = byNumber.filter(item => item.number === 1)
            sorted[1] = byNumber.filter(item => item.number === 3)
            sorted[2] = byNumber.filter(item => item.number !== 3 && item.number !== 1)

            return sorted.reduce((prev, cur) => prev.concat(cur), [])
        },
        isTop(value) {
            if(value === 1)
                return true
            if(value === 3 && this.winnerCard.number !== 1) 
                return true
            if(this.winnerCard.number === 1)
                return false
            if(this.winnerCard.number ===3)
                return false
            return value > this.winnerCard.number
        },
        getPosition(id) {
            return this.game.players.map( item => item._id.toString()).indexOf(id)
        }
    },
    watch: {
        'game.state': function(newVal) {
            if(newVal===2) {
                debug('newVal',this.ready)
                this.ready=false
                debug('newVal',newVal)
            }
        }
    },
    computed: {
        ...mapState({
            game: state => state.match.game,
            loading: state => state.match.fetchStatus === 'fetching',
            user: state => state.auth.user,
            socketId: state => state.match.socketId
        }),
        mandatory() {
            return this.game.mandatoryCard
        },
        activePlayerId() {
            return this.game && this.game.players && this.game.players[this.game.activePlayer] && this.game.players[this.game.activePlayer]._id
        },
        isYourTurn() {
            return this.activePlayerId === this.user._id && !this.loading 
        },
        position() {
            return this.game && this.game.players &&  this.game.players.map( item => item._id.toString()).indexOf(this.user._id)
        },
        playerCards() {
            return this.game && this.game.playersCards && this.game.playersCards.filter(item=>item.id === this.user._id)[0].cards
        },
        sortedCards() {
            return this.sortCards(this.playerCards)
        },
        orderedCards() {
            return this.types.map((item) => this.sortedCards.filter(card => card.type === item))
                .reduce((prev, cur) => prev.concat(cur), [])
        },
        pushedCards(){
            return this.game && this.game.playersCards && this.game.playersCards.map( item => item.pushedCard )
        },
        winnerCard() {
            let triumphs = this.pushedCards.filter( item => item.type === this.game.triumphCard.type)
            let sameType = this.pushedCards.filter( item => item.type === this.game.mandatoryCard.type)
            if (triumphs.length>0)
                return this.sortCards(triumphs)[0]
            else
                return this.sortCards(sameType)[0]
        },
        sameType() {
            return this.orderedCards.filter( item => item.type === this.mandatory.type)
        },
        arrastre() {
            return this.mandatory && this.game && this.game.triumphCard && this.mandatory.type === this.game.triumphCard.type
        },
        canWin(){
            return this.sameType && this.sameType.filter(item => this.isTop(item.number))  
        },
        triumphs() {
            return this.orderedCards.filter( item => item.type === this.game.triumphCard.type)
        },
        allowedCards() {
            if(!this.mandatory || this.mandatory.type==='Empty')
                return this.orderedCards

            //check cards for the same type
            let sameType = this.orderedCards.filter( item => item.type === this.mandatory.type)

            debug('this.mandatory.type',this.mandatory.type)
            debug('this.game.triumphCard.type',this.game.triumphCard.type)
            // check "arrastre"
            if(this.arrastre) {
                debug('Arrastre')
                if(this.sameType.length>0) {
                    // let canWin = this.sameType.filter(item => this.isTop(item.number))
                    if(this.canWin.length>0)
                        return this.canWin.map(item=>item)
                    else
                        return this.sameType
                } else {
                    return this.orderedCards
                }
            }

            if(this.sameType.length>0) {
                //if winner have same type of mandatory
                if(this.winnerCard.type === this.mandatory.type) {
                    let canWin = sameType.filter(item => this.isTop(item.number))
                    if(canWin.length>0)
                        return canWin
                    else
                        return this.sameType
                } else {
                    return this.sameType
                }       
            } else {
                if(this.winnerCard.type === this.game.triumphCard.type) {
                    debug('someone use a triumph before you')
                    let canWin = this.triumphs.filter(item => this.isTop(item.number))
                    if(canWin.length>0)
                        return canWin
                    else
                        return this.orderedCards
                } else {
                    if(this.triumphs.length>0)
                        return this.triumphs
                    else
                        return this.orderedCards
                }
            }

        }
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';
.celm-room--container {
    width:100%;
    max-width:70rem;
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
        .desk-cards, .triumphCard {
            display:inline;
            button {
                padding:0;
            }
        }
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
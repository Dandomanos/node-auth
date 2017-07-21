<template>
    <div class="celm-gameContainer" v-if="user && user.emailActive">
    <div class="celm-games" v-if="games">
        <h2>GAMES</h2>
        <ul class="columns is-multiline">
            <li v-for="game in games" class="column is-6 game">
                <div class="box">
                    <div class="title">
                        <h3>{{gameTypes[game.type]}}</h3>
                        <small>{{game._id}}</small>
                    </div>
                    <div class="columns is-mobile" v-if="game.players.length===2">
                        
                        <button
                            class="button celm-player-button box column is-6"
                            v-for="n in game.players.length"
                            :class="{'freePlace': game.players[n-1].role==='Phantom'}"
                            @click="enterGame(game._id, n-1)"
                            :disabled="game.players[n-1].role!=='Phantom'"
                            >
                            
                            <img src="../../../static/game/user.svg" alt="">
                            <small v-if="game.players[n-1].role!=='Phantom'">{{game.players[n-1].username}}</small>
                            <small v-else>Player {{n}}</small>
                        </button>
                    </div>
                    <div v-else="game.players.length===4" class="tile is-ancestor is-vertical">
                        <div class="tile is-parent">

                            <div class="tile is-child is-4">
                            <!-- player 2 -->
                                <button
                                    class="button celm-player-button box"
                                    :class="{'freePlace': game.players[1].role==='Phantom'}"
                                    @click="enterGame(game._id, 1)"
                                    :disabled="game.players[1].role!=='Phantom'"
                                    >
                                    
                                    <img src="../../../static/game/user.svg" alt="">
                                    <small v-if="game.players[1].role!=='Phantom'">{{game.players[1].username}}</small>
                                    <small v-else>Player {{2}}</small>
                                </button>
                            </div>


                        </div>
                        <div class="tile is-parent">
                            <div class="tile is-child is-4">
                            player 1
                            </div>
                            <div class="tile is-child is-4">
                            </div>
                            <div class="tile is-child is-4">
                            player 3
                            </div>
                        </div>
                        <div class="tile is-parent">
                            
                            <div class="tile is-child is-4">
                            player 4
                            </div>
                            
                        </div>

                    </div>
                </div>
            </li>
        </ul>
    </div>
    <!--
        <div class="celm-toolbar">
            <button @click="createDesk()" class="celm-button is-toolbar">New Desk</button>
        </div>
        <div class="celm-game">  
            <card v-for="card in desk" :type="card.type" :number="card.number" :key="card.number+card.type"></card>
        </div>
    -->
    </div>
    <div v-else>
        You must to confirm your email to play a game.
        <button
            class="button celm-button"
            type="button"
            :class="{'is-loading':loading}"
            @click="sendEmail()">
            Send confirmation email
        </button>
        <form-messages-handler v-if="!loading">
        </form-messages-handler>
    </div>
</template>

<script>
// import anime from 'animejs'
import {mapState, mapActions} from 'vuex'
import Card from '../commons/Card'
import FormMessagesHandler from '../commons/FormMessagesHandler'
import FormValidatorMixin from '../../mixins/FormValidatorMixin.js'
import TablePlayer from '../commons/TablePlayer'
const debug = require('debug')('GAME => ')
export default {
    name: 'Game',
    components: {
        Card,
        FormMessagesHandler,
        TablePlayer
    },
    mixins: [FormValidatorMixin],
    data () {
        return {
            types:['Oros','Copas', 'Espadas', 'Bastos'],
            numbers: [1,2,3,4,5,6,7,10,11,12],
            desk:null,
            gameTypes:['Carta más alta']
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
        },
        ...mapActions({
            sendEmail:'auth/SEND_CONFIRMATION_EMAIL',
            getGames:'games/GET_GAMES',
            setPlayer:'games/SET_PLAYER'
        }),
        async enterGame(gameId, position) {
            let data = {
                gameId:gameId,
                position:position
            }
            debug('gameId',gameId)
            this.setPlayer(data)
            await this.$router.replace({name:'Room', params: {gameId:gameId}}) 
        }

    },
    computed: {
        ...mapState({
            user: state => state.auth.user,
            games: state => state.games.games
        }),
    },
    mounted() {
        this.getGames()
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/_const.scss';
.celm-gameContainer {
    margin: $game-margin auto;
    padding: $game-margin;
}
.celm-games {
    .box {
        background-color:lighten($button-bg-color, 5)
    }
    .celm-player-button {
        height:100%;
        flex-direction: column;
        display: flex;
        &[disabled]{
            opacity:1;
        }
    }
    .tile.is-child.is-4 {
        margin:0 auto!important;
    }
}
.celm-game {
    width:100%;
    max-width:$game-max-width;
    margin:0 auto;
    height:$game-max-height;
    border:$game-border;
    position:relative;
}
.freePlace {
    opacity:0.5;
}
</style>

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
                    <div class="cards" v-if="game.desk">
                     <!-- {{game.desk}} -->
                    <card v-for="card in game.desk" :type="card.type" :number="card.number" :key="card.number+card.type"></card>
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
        })
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
    width:80%;
    max-width:25rem;
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
        // width:100%;
        // height:100%;
        // max-width:40rem;
        // max-height:40rem;
        // margin:0 auto;
        border:$input-border;
    }
}
</style>
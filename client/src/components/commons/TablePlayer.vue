<template>
    <button
        class="button celm-player-button box"
        :class="{'freePlace': game.players[index].role==='Phantom'}"
        @click="enterGame(game._id, index)"
        :disabled="game.players[index].role!=='Phantom'"
        >
        
        <img src="../../../static/game/user.svg" alt="">
        <small v-if="game.players[index].role!=='Phantom'">{{game.players[index].username}}</small>
        <small v-else>Player {{index+1}}</small>
    </button>
</template>

<script>

export default {
    name: 'TablePlayer',
    props:['game', 'index'],
    computed: {
        
    }
}
</script>
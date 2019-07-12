<template>
    <div
        class="celm-gamePlayer"
        :class="{'is-phantom':player.role==='Phantom', 'is-active':player._id===activeId}"
    >
        <img src="../../../static/game/user.svg" alt="">
        <template v-if="player.role==='Phantom'">
            Player {{index+1}}
        </template>
        <template v-else>
            {{player.username}}
        </template>
    </div>
</template>

<script>

export default {
    name: 'GamePlayer',
    props:['player', 'index', 'activeId'],
    computed: {
        
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';

</style>



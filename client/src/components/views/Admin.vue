<template>
    <div class="celm-control-panel" v-if="isAdmin">
        <div class="celm-toolbar">
            <button class="celm-button is-toolbar" @click="createGame" >
                Create Game
            </button>
            <button class="celm-button is-toolbar" @click="getUsers">
                Get Users
            </button>
        </div>
        <div class="users" v-if="users">
            <ul>
                <li v-for="user in users">
                    <h4>{{user.username}}</h4> 
                    {{user.firstName}} {{user.lastName}} 
                    <small>[{{user.email}}] <b>{{user.role}}</b> 
                        <b v-if="user.emailActive" class="is-success">CONFIRMED EMAIL</b>
                        <b v-else="user.emailActive" class="is-warning">UNVERIFIED EMAIL</b>
                    </small> 
                    {{user.games.length}}
                </li>
            </ul>
        </div>
    </div>
    <div v-else>
        Sorry this is a private area.
    </div>
</template>

<script>
const debug = require('debug')('ADMIN => ')
import {mapGetters, mapActions,mapState} from 'vuex'
export default {
    name: 'Admin',
    data () {
        return {

        }
    },
    computed:{
        ...mapGetters('auth', ['isLogged', 'user']),
        isAdmin() {
            return this.isLogged && this.user && this.user.role === 'Admin'
        },
        ...mapState({
            users: state => state.users.users,
        })     
    },
    methods: {
        createGame() {
            debug('Adding new game')
        },
        ...mapActions({
            getUsers:'users/GET_USERS'
        })
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';
.celm-control-panel{
    margin:$control-panel-margin auto;
    padding:$control-panel-padding;
    .users {
        border:$control-panel-user-border;
        padding:$control-panel-padding;
        li {
            display:block;
            h4 {
                font-weight:bold;
                margin:0;
                display:inline-block;
            }
        }
    }
}
</style>

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
                <li class="columns is-head hidden-xs">
                    <div class="column is-2">
                        <h4>Username</h4> 
                    </div>
                    <div class="column is-4">
                        Name
                    </div>
                    <div class="column is-4">
                        Email[Role]</small> 
                    </div>
                    <div class="column is-1">
                        Active
                    </div>
                    <div class="column is-1">
                        Games
                    </div>
                </li>
                
                <li v-for="user in users" class="columns">
                    <div class="column is-2">
                        <h4>{{user.username}}</h4> 
                    </div>
                    <div class="column is-4">
                    {{user.firstName}} {{user.lastName}} 
                    </div>
                    <div class="column is-4">
                        <small>{{user.email}} <b>[{{user.role}}]</b></small> 
                    </div>
                    <div class="column is-1">
                        <b v-if="user.emailActive" class="is-success">V</b>
                        <b v-else="user.emailActive" class="is-warning">X</b>
                    </div>
                    <div class="column is-1">
                        {{user.games.length}}
                    </div>
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
            border-bottom:$input-border;
            &.is-head {
                background-color:$button-bg-color;
                color:$button-font-color;
                font-weight:bold;
                h4 {
                    color:$button-font-color;
                }
            }
            &:last-child {
                border-bottom:none
            }
            .column {
                border-right:$input-border;
                &:last-child {
                    border-right:none;
                }
                padding:0;
                @media (min-width:768px) {
                    padding:$control-panel-padding;
                }
            }
            h4 {
                font-weight:bold;
                margin:0;
                display:inline-block;
            }
        }
    }
}
</style>

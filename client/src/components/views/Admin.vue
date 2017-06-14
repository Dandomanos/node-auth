<template>
    <div class="control-panel" v-if="isAdmin">
        <div class="toolbar">
            <button class="is-main" @click="createGame" >
                Create Game
            </button>
            <button class="is-main" @click="getUsers">
                Get Users
            </button>
        </div>
        <div class="users" v-if="users">
            <ul>
                <li v-for="user in users">
                    <b>{{user.firstName}} {{user.lastName}}</b> {{user.email}} <small>[{{user.role}}]</small>
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
.control-panel{
    margin:1rem auto;
    padding:1rem;
    .toolbar {
        position:absolute;
        top:1rem;
    }
    .users {
        border:1px solid #ccc;
        padding:1rem;
        li {
            display:block;
        }
    }
}
</style>

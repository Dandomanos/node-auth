<template>
    <div class="secretquote">
        <h1>Private Area</h1>
        USERS => <br>
        <ul>
            <li v-for="user in users">
                {{user.email}} [<small><b>{{user.role}}</b></small>]
            </li>
        </ul>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
// const debug = require('debug')('PRIVATE')
export default {
    name: 'SecretQuote',
    data () {
        return {
        }
    },
    methods: {
        ...mapActions({
            getUsers:'users/GET_USERS'
        })
    },
    computed: {
        ...mapState({
            fetchStatus: state => state.users.fetchStatus,
            fetchError: state => state.users.fetchError,
            users: state => state.users.users
        })
    },
    async created() {
        await this.getUsers()
    }
}
</script>

<style>

</style>

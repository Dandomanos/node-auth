<template>
    <ul>
        <li>
            <router-link :to="'/home'">
                Home
            </router-link>
        </li>
        <li v-if="isLogged">
            <router-link :to="'/secretquote'">
                Private Area
            </router-link>
        </li>
        <li v-if="isLogged">
            <router-link :to="'/game'">
                Game
            </router-link>
        </li>
        <li v-if="!isLogged">
            <router-link :to="'/login'">
                Login
            </router-link>
        </li>
        <li v-else>
            <router-link :to="'/logout'">
                Logout
            </router-link>
        </li>
        <li>
            <router-link :to="'/register'">
                Sign Up
            </router-link>
        </li>
    </ul>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'

export default {
    name: 'User',
    data () {
        return {
            
        }
    },
    methods: {
        ...mapActions({
            logout:'auth/LOGOUT'
        })
    },
    // mounted(){
    //     // this.logout()
    // },
    computed:{
        ...mapGetters('auth', ['isLogged'])
    }
}
</script>
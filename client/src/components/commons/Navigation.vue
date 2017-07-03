<template>
    <ul>
        <li>
            <router-link :to="'/home'">
                Home
            </router-link>
        </li>
        <li v-if="isAdmin">
            <router-link :to="'/admin'">
                Admin
            </router-link>
        </li>
        <li v-if="isLogged">
            <a @click="goToProfile">
                Profile
            </a>
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
        <li v-if="!isLogged">
            <router-link :to="'/register'">
                Sign Up
            </router-link>
        </li>
    </ul>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
const debug = require('debug')('navigation')
export default {
    name: 'Navigation',
    data () {
        return {
            
        }
    },
    methods: {
        ...mapActions({
            logout:'auth/LOGOUT',
            clearFetchError:'auth/CLEAR_ERROR',
            clearFetchResult: 'auth/CLEAR_RESULT',
        }),
        goToProfile() {
            this.resetForms()
            debug('navigation to Profile')
            this.$router.replace({name:'Profile'})
        },
        resetForms() {
            this.clearFetchError()
            this.clearFetchResult()
        }
        
    },
    computed:{
        ...mapGetters('auth', ['isLogged', 'user']),
        isAdmin() {
            return this.isLogged && this.user && this.user.role === 'Admin'
        }
    }
}
</script>
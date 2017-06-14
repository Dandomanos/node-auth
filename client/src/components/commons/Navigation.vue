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
            <router-link :to="'/profile'">
                Profile
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
        <li v-if="!isLogged">
            <router-link :to="'/register'">
                Sign Up
            </router-link>
        </li>
    </ul>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'

export default {
    name: 'Navigation',
    data () {
        return {
            
        }
    },
    methods: {
        ...mapActions({
            logout:'auth/LOGOUT'
        })
    },
    computed:{
        ...mapGetters('auth', ['isLogged', 'user']),
        isAdmin() {
            return this.isLogged && this.user && this.user.role === 'Admin'
        }
    }
}
</script>
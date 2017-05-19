<template>
    <div id="app">
        <nav>
            <div class="container">
                <navigation></navigation>
                <user></user>
                logged:{{isLogged}}
            </div>
        </nav>

        <router-view></router-view>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
const debug = require('debug')('APP.VUE')
import User from './components/User'
import Navigation from './components/layout/Navigation'

export default {
    data () {
        return {
            menu : [
                {
                    title: 'Home',
                    path: '/home'
                },
                {
                    title: 'Login',
                    path: '/login'
                },
                {
                    title: 'Sign Up',
                    path: '/signup'
                },
                {
                    title: 'Secret Quote',
                    path: 'secretquote'
                },
                {
                    title: 'Logout',
                    path: '/logout'
                }
            ]
        }
    },
    name: 'app',
    components:{
        User,
        Navigation
    },
    computed:{
        ...mapGetters('auth', ['isLogged'])
    },
    watch:{
        isLogged(){
            debug('checking if is logged')
            let current = this.$route.name
            if(this.isLogged) {
                debug('is logged')
                if(current == 'Login')
                    this.$router.replace({name:'SecretQuote'})
            } else {
                debug('not logged')
                if(current != 'Login') {
                    debug('redirect to login')
                    this.$router.replace({name:'Login'})
                }
            }
        }
    },
    created() {
        this.$store.dispatch('auth/RECOVER_TOKEN')
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>

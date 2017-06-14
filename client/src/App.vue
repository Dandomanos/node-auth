<template>
    <div id="app" class="hero is-fullheight">
        <layout-header class="hero-head"></layout-header>
        <div class="hero-body">
            <div class="container">
                <router-view></router-view>
            </div>
        </div>
        <layout-footer class="hero-foot"></layout-footer>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
const debug = require('debug')('APP.VUE')
import LayoutHeader from './components/layout/LayoutHeader'
import LayoutFooter from './components/layout/LayoutFooter'

export default {
    data () {
        return {
            
        }
    },
    name: 'app',
    components:{
        LayoutHeader,
        LayoutFooter
    },
    computed:{
        ...mapGetters('auth', ['isLogged'])
    },
    watch:{
        isLogged(){
            debug('checking if is logged')
            let current = this.$route.name
            if(this.isLogged) {
                debug('is logged', this.isLogged)
                if(current == 'Login')
                    this.$router.replace({name:'Profile'})
            } else {
                debug('not logged')
                if(current != 'Login') {
                    debug('redirect to login')
                    this.$router.replace({name:'Login'})
                }
            }
        }
    },
    async created() {
        await this.isLogged ? this.getUser() : true
    },
    methods: {
        ...mapActions({
            getUser:'auth/GET_USER'
        })
    }
}
</script>

<style lang="scss">
@import '~bulma/bulma.sass';
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
*{
    box-sizing:border-box;
    margin:0;
    padding:0;
}
h1 {
    color: #2e815b;
    font-weight:bold;
    font-size:2rem;
}
.primary-button {
    display:block;
    width:100%;
    max-width:20rem;
    padding:0.5rem 1rem;
    background-color:#d6f1e5;
    margin:0.5rem auto;
    color:#2e815b;
    font-weight:bold;
    text-decoration:none;
    -webkit-appearance: none;
    appearance:none;
    border:none;
    box-shadow:none;
    font-size:1rem;
    &:focus {
        outline:none;
    }
}
.form-group {
    margin-bottom:1rem;
}
.primary-input {
    width:100%;
    max-width:20rem;
    padding:0.5rem 1rem;
    &:focus {
        outline:none;
    }
}
form {
    width:100%;
    max-width:20rem;
    margin:0 auto;
}
.form-group {
    label {
        display:block;
        text-align:left;
        font-size:1rem;
        font-weight:bold;
    }
}
</style>

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
@import './assets/scss/main.scss';









</style>

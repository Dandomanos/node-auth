<template>
    <div>
        Session cerrada correctamente
    </div>
</template>

<script>
import {mapActions} from 'vuex'
// const debug = require('debug')('app:HOME')
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
    mounted(){
        this.logout()
    }
}
</script>
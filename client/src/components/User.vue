<template>
    <div class="user" v-if="user">
        Welcome {{user.firstName}} {{user.lastName}}<br>
        {{user.profile}}
        <small>{{user.email}}</small>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
// const debug = require('debug')('app:HOME')
export default {
    name: 'User',
    data () {
        return {
            
        }
    },
    methods: {
       
    },
    computed:{
        ...mapGetters('auth', ['user'])
    }
}
</script>
<template>
    <div class="home">
        <h1>{{title}}</h1>
        <img src="../../assets/logo.png">
        <div class="user" v-if="user">
            {{user.email}}
        </div>
        <div class="actions" v-else>
            <ul>
                <li>
                    <router-link :to="'/login'" class="primary-button">
                        I have an account
                    </router-link>
                </li>
                <li>
                    <router-link :to="'/register'" class="primary-button">
                        I'm new
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
// const debug = require('debug')('app:HOME')
import {mapGetters} from 'vuex'
export default {
    name: 'Home',
    data () {
        return {
            title: 'Welcome to Home view',
            data: false
        }
    },
    methods: {

    },
    computed:{
        ...mapGetters('auth', ['user'])
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
  margin:1rem;
}

</style>

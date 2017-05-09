import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SecretQuote from '@/components/SecretQuote.vue'
import Signup from '@/components/Signup.vue'
import Login from '@/components/Login.vue'
import VueResource from 'vue-resource'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: 'secretquote',
            name: 'SecretQuote',
            component: SecretQuote
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})

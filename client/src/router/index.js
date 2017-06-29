import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/views/Home.vue'
import Profile from '@/components/views/Profile.vue'
import Login from '@/components/views/Login.vue'
import Logout from '@/components/views/Logout.vue'
import Register from '@/components/views/Register.vue'
import store from '../store/index'
import Game from '@/components/views/Game.vue'
import Admin from '@/components/views/Admin.vue'
import Recover from '@/components/views/Recover.vue'

Vue.use(Router)

const debug = require('debug')('ROUTER')

const router = new Router({
    mode: 'history',
    routes : [
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta:{requiredAuth:false}
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
            meta:{requiredAuth:true}
        },
        {
            path: '/game',
            name: 'Game',
            component: Game,
            meta:{requiredAuth:true}
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta:{requiredAuth:false}
        },
        {
            path: '/register',
            name: 'Register',
            component: Register,
            meta:{requiredAuth:false}
        },
        {
            path: '/logout',
            name: 'Logout',
            component: Logout,
            meta:{requiredAuth:false}
        },
        {
            path: '/recover',
            name: 'Recover',
            component: Recover,
            meta:{requiredAuth:false}
        },
        {
            path: '/admin',
            name: 'Admin',
            component: Admin,
            meta:{requiredAuth:true}
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})

router.beforeEach((to,from,next)=>{
    debug('starting before each')
    let TName = to.name
    let FName = from.name
    debug('going from ', FName, 'to', TName)
    let authRequired = to.matched.some(route=> route.meta.requiredAuth)
    debug('authRequired', authRequired)
    //Initial logged state
    debug('token',store.state.auth['token'])
    if(store.state.auth.token===null) {
        debug('initial state',store.state)
        store.dispatch('auth/RECOVER_TOKEN')
        // next(false)
        // router.replace(to.fullPath)
        // return
    }

    //Redirect to non auth route 
    if(to.matched.some(route=> route.meta.requiredAuth===true)) {
        debug('store auth token', store.state.auth.token)
        // if(!store.state.auth.isLogged) {
        if(!store.state.auth.token) {
            debug('redirect to Login')
            next(false)
            router.replace({name:'Login'})
            return
        }
    }

    //Redirect to auth route
    // if(to.matched.some(route=> route.meta.requiredAuth===false)) {
    //     if(store.state.auth.isLogged) {
    //         next()
    //     }
    // }

    next()

})

export default router

// export default new Router({
//     routes: [
//         {
//             path: '/',
//             name: 'Home',
//             component: Home
//         },
//         {
//             path: 'secretquote',
//             name: 'SecretQuote',
//             component: SecretQuote
//         },
//         {
//             path: '/login',
//             name: 'Login',
//             component: Login
//         },
//         {
//             path: '/signup',
//             name: 'Signup',
//             component: Signup
//         },
//         {
//             path: '*',
//             redirect: '/'
//         }
//     ]
// })

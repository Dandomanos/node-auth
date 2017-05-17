import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SecretQuote from '@/components/SecretQuote.vue'
import Signup from '@/components/Signup.vue'
import Login from '@/components/Login.vue'
import Logout from '@/components/Logout.vue'
import store from '../store/index'
// import VueResource from 'vue-resource'

Vue.use(Router)
// Vue.use(VueResource)

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
            path: '/secretquote',
            name: 'SecretQuote',
            component: SecretQuote,
            meta:{requiredAuth:true}
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta:{requiredAuth:false}
        },
        {
            path: '/logout',
            name: 'Logout',
            component: Logout,
            meta:{requiredAuth:false}
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup,
            meta:{requiredAuth:false}
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
    // if(store.state.auth.isLogged===null) {
    //     next(false)
    //     router.replace(to.fullPath)
    //     return
    // }

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

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from './authModule'
import users from './usersDataModule'

export default new Vuex.Store({
    state: {

    },
    mutations: {

    },
    actions: {

    },
    modules: {
        auth,
        users
    }
})
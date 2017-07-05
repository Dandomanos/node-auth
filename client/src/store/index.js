import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from './authModule'
import users from './usersDataModule'
import match from './matchModule'
import games from './gamesModule'

export default new Vuex.Store({
    state: {

    },
    mutations: {

    },
    actions: {

    },
    modules: {
        auth,
        users,
        match,
        games
    }
})
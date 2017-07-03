import * as api from '../lib/api'
const debug = require('debug')('USERS-DATA')

export default {
    namespaced:true,
    state: {
        fetchStatus:null,
        fetchError:null,
        games:null
    },
    mutations: {
        FETCH_STARTED(state) {
            state.fechStatus = 'fetching'
            state.users = false
            state.fetchError = null
        },
        SET_GAMES(state, games) {
            state.fetchStatus = 'success'
            state.games = games
        },
        SET_FETCH_ERROR(state, error) {
            state.fetchStatus = 'failed'
            state.fetchError = error && error.data
        }
    },
    actions: {
        async GET_GAMES({commit,rootState}) {
            commit('FETCH_STARTED')
            try {
                debug('token from rootState', rootState.auth.token)
                let data = await api.getGames(rootState.auth.token)
                debug('games',data.games)
                commit('SET_GAMES', data.games)
            } catch(err){
                commit('SET_FETCH_ERROR', err)
            }
        },
        async CREATE_GAME({commit, rootState},{type}) {
            commit('FETCH_STARTED')
            try {
                let data = await api.createGame(type, rootState.auth.token)
                debug('data', data)
                commit('SET_GAMES', data.games)
            } catch(err) {
                commit('SET_FETCH_ERROR', err)                
            }
        }
    },
    getters:{
        games:state=>state.games
    }
}
import * as api from '../lib/api'
const debug = require('debug')('USERS-DATA')

export default {
    namespaced:true,
    state: {
        fetchStatus:null,
        fetchError:null,
        users:null,
        user:null
    },
    mutations: {
        FETCH_STARTED(state) {
            state.fechStatus = 'fetching'
            state.users = false
            state.fetchError = null
        },
        SET_USERS(state, users) {
            state.fetchStatus = 'success'
            state.users = users.users
            state.user = users.user
        },
        CLEAR_USERS(state) {
            debug('clear')
            state.users = null
            state.fetchStatus = null
        },
        SET_FETCH_ERROR(state, error) {
            state.fetchStatus = 'failed'
            state.fetchError = error && error.data
        }
    },
    actions: {
        async GET_USERS({commit,rootState}) {
            commit('FETCH_STARTED')
            try {
                debug('token from rootState', rootState.auth.token)
                let data = await api.getUsers(rootState.auth.token)
                debug('users',data.users)
                commit('SET_USERS', data)
            } catch(err){
                commit('SET_FETCH_ERROR', err)
            }
        }
    },
    getters:{
        users:state=>state.users
    }
}
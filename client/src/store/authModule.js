import * as api from '../lib/api'
const debug = require('debug')('AUTH')

export default {
    namespaced:true,
    state: {
        fetchStatus:null,
        token:null,
        fetchError:null,
        user:null
    },
    mutations: {
        FETCH_STARTED(state) {
            state.fechStatus = 'fetching'
            state.token = false
            state.fetchError = null
        },
        SET_TOKEN(state, token) {
            state.fetchStatus = 'success'
            state.token = token
        },
        SET_USER(state,user) {
            state.user = user
        },
        CLEAR_TOKEN(state) {
            debug('Logout')
            state.user = null
            state.token = false
            state.fetchStatus = null
        },
        SET_FETCH_ERROR(state, error) {
            state.fetchStatus = 'failed'
            state.fetchError = error && error.data
        }
    },
    actions: {
        RECOVER_TOKEN({commit}) {
            let token = window.localStorage.getItem('token')
            if(token)
                commit('SET_TOKEN', token)
            else
                commit('CLEAR_TOKEN')
        },
        async LOGIN({commit},{email,password}) {
            commit('FETCH_STARTED')
            try {
                let data = await api.authenticate(email,password)
                window.localStorage.setItem('token', data.token)
                debug('user',data.user)
                commit('SET_USER', data.user)
                commit('SET_TOKEN',data.token)
            } catch(err){
                commit('SET_FETCH_ERROR', err)
            }
        },
        LOGOUT({commit}) {
            window.localStorage.removeItem('token')
            commit('CLEAR_TOKEN')
        }
    },
    getters:{
        isLogged:state=>state.token,
        user:state=>state.user
    }
}



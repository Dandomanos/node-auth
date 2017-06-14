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
            // state.fetchStatus = 'success'
            state.token = token
        },
        SET_USER(state,user) {
            state.user = user
            state.fetchStatus = 'success'
        },
        GET_TOKEN(state) {
            return state.token
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
            if(token) {
                commit('SET_TOKEN', token)
            } else {
                commit('CLEAR_TOKEN')
            }
        },
        async GET_USER({commit,state}) {
            // commit('FETCH_STARTED')
            try {
                debug('token from state', state.token)
                let data = await api.getUser(state.token)
                debug('users',data.users)
                commit('SET_USER', data.user)
            } catch(err){
                commit('SET_FETCH_ERROR', err)
            }
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
        async REGISTER({commit},{email,password,firstName,lastName}) {
            commit('FETCH_STARTED')
            try {
                debug('email',email, 'password', password, 'firstName', firstName, 'lastName',lastName)
                let data = await api.register(email,password,firstName,lastName)
                window.localStorage.setItem('token', data.token)
                debug('user',data.user)
                commit('SET_USER', data.user)
                commit('SET_TOKEN',data.token)
            } catch(err){
                commit('SET_FETCH_ERROR', err)
            }
        },
        LOGOUT({commit}) {
            debug('clear token')
            window.localStorage.removeItem('token')
            commit('CLEAR_TOKEN')
        }
    },
    getters:{
        isLogged:state=>state.token,
        user:state=>state.user
    }
}

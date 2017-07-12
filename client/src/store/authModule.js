import * as api from '../lib/api'
const debug = require('debug')('AUTH')

export default {
    namespaced:true,
    state: {
        fetchStatus:null,
        fetchError:null,
        fetchResult:null,
        token:null,
        user:null
    },
    mutations: {        
        FETCH_STARTED(state) {
            state.fetchStatus = 'fetching'
            state.token = false
            state.fetchError = null
        },
        FETCH_LOGGED_STARTED(state){
            state.fetchStatus = 'fetching'
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
        SET_SUCCESS(state) {
            state.fetchStatus = 'success'
        },
        PASSWORD_UPDATED(state) {
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
        CLEAR_ERROR(state) {
            debug('Clear Error')
            state.fetchStatus = null
            state.fetchError = null
        },
        CLEAR_RESULT(state) {
            debug('Clear Result')
            state.fetchStatus = null
            state.fetchResult = null
        },
        SET_FETCH_ERROR(state, error) {
            debug('error', error)
            state.fetchStatus = 'failed'
            state.fetchError = error && error.data
        },
        SET_FETCH_RESULT(state, result) {
            debug('result', result)
            state.fetchResult = result
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
            commit('FETCH_LOGGED_STARTED')
            try {
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
        async UPDATE({commit,state},{username,firstName,lastName}) {
            commit('FETCH_LOGGED_STARTED')
            debug('firstName',firstName, 'lastName',lastName)
            try {
                let data = await api.updateProfile(username,firstName,lastName,state.token)
                debug('data',data.user)
                commit('SET_USER', data.user)
            } catch(err){
                commit('SET_FETCH_ERROR', err)
            }
        },
        async CHANGE_PASSWORD({commit,state},{password,newPassword,confirmNewPassword}) {
            commit('FETCH_LOGGED_STARTED')
            debug('password',password, 'newPassword',newPassword, 'confirmNewPassword',confirmNewPassword)
            try {
                let data = await api.changePassword(password,newPassword,confirmNewPassword,state.token)
                debug('data',data)
                commit('PASSWORD_UPDATED')
            } catch(err){
                commit('SET_FETCH_ERROR', err)
            }
        },
        async REGISTER({commit},{username,email,password,firstName,lastName}) {
            commit('FETCH_STARTED')
            try {
                debug('email',email, 'password', password, 'firstName', firstName, 'lastName',lastName)
                let data = await api.register(username,email,password,firstName,lastName)
                window.localStorage.setItem('token', data.token)
                debug('user',data.user)
                commit('SET_USER', data.user)
                commit('SET_TOKEN',data.token)
                commit('SET_FETCH_RESULT',{message:'We just to send an email to ' + email + '.<br>You must to confirm your account to play a game.'})
            } catch(err){
                commit('SET_FETCH_ERROR', err)
            }
        },
        async RECOVER_PASSWORD({commit}, {email}) {
            commit('FETCH_STARTED')
            try {
                debug('email',email)
                let data = await api.recoverPass(email)
                debug('pass recovered', data)
                commit('SET_SUCCESS')
            } catch(err) {
                commit('SET_FETCH_ERROR', err)
            }
        },
        async SEND_CONFIRMATION_EMAIL({commit, state}){
            commit('FETCH_LOGGED_STARTED')
            try {
                let data = await api.SendConfirmationEmail(state.token)
                debug('Confirmation email sended to ' +  data.email)
                commit('SET_SUCCESS')
                commit('SET_FETCH_RESULT',{message:'Confirmation email sended to ' +  data.email})
            } catch(err) {
                commit('SET_FETCH_ERROR', err)
            }
        },
        async CONFIRM_EMAIL({commit},{token}){
            commit('FETCH_LOGGED_STARTED')
            try {
                let data = await api.confirmEmail(token)
                debug(data.email + ' confirmed', data.user)
                commit('SET_USER', data.user)
                commit('SET_FETCH_RESULT',{message:data.email + ' confirmed succesfully'})
            } catch(err) {
                commit('SET_FETCH_ERROR', err)
            }
        },
        LOGOUT({commit}) {
            debug('clear token')
            window.localStorage.removeItem('token')
            commit('CLEAR_TOKEN')
        },
        CLEAR_ERROR({commit}) {
            commit('CLEAR_ERROR')
        },
        CLEAR_RESULT({commit}) {
            commit('CLEAR_RESULT')
        },
        SET_ERROR({commit},{error}) {
            debug('error', error)
            commit('SET_FETCH_ERROR', error)
        },
        SET_RESULT({commit},{result}) {
            commit('SET_FETCH_RESULT',result)
        }
    },
    getters:{
        isLogged:state=>state.token,
        user:state=>state.user
    }
}


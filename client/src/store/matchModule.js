import * as api from '../lib/api'
const debug = require('debug')('MATCH-MODULE')

export default {
    namespaced:true,
    state: {
        fetchStatus:null,
        fetchError:null,
        game:null,
        connected:false
    },
    mutations: {
        FETCH_STARTED(state) {
            state.fechStatus = 'fetching'
            state.fetchError = null
        },
        SET_GAME(state, game) {
            state.fetchStatus = 'success'
            state.game = game
        },
        SET_FETCH_ERROR(state, error) {
            state.fetchStatus = 'failed'
            state.fetchError = error && error.data
        },
        SOCKET_CONNECT: (state) => {
            debug('Socket Connected from Game')
            state.connected = true
        },
        SOCKET_GAMEUPDATED: (state, game) => {
            debug('GAME updated', game)
            state.game = game.game
        }
    },
    actions: {
        async GET_GAME({commit,rootState},{gameId}) {
            debug('gameId', gameId)
            commit('FETCH_STARTED')
            try {
                debug('token from rootState', rootState.auth.token)
                let data = await api.getGames(rootState.auth.token, gameId)
                debug('game',data.game)
                commit('SET_GAME', data.game)
            } catch(err){
                commit('SET_FETCH_ERROR', err)
            }
        },
        async PUSH_CARD({commit,rootState,state},{card}) {
            debug('gameId', state.game._id, 'cardToPush', card)
            commit('FETCH_STARTED')
            try {
                await api.pushCard(rootState.auth.token, state.game._id, card)
                
                // let data = await api.pushCard(rootState.auth.token, state.game._id, card)
                // debug('game',data.game)
                // commit('SET_GAME', data.game)
            } catch(err) {
                commit('SET_FETCH_ERROR', err)
            }
        }
    },
    getters:{
        game:state=>state.game
    }
}
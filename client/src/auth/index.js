import {router} from '../main'
import axios from 'axios'

//URL and EndPoints constant
const API_URL = 'http://localhost:3000/api/'
const LOGIN_URL = API_URL + 'auth/login/'
const SIGNUP_URL = API_URL + 'auth/register/'

const debug = require('debug')('API')

export default {

    // User object will let us check authentication status
    user: {
        authenticated : false
    },
    async login(creds) {
        debug('login in')    
        let data = await axios.post(LOGIN_URL, creds)
        return data

    },
    singup(context, creds, redirect) {
        context.$http.post(SIGNUP_URL, creds)
        .then(data=>{
            console.log('data after signup', data)
            localStorage.setItem('id_token', data.id_token)
            localStorage.setIten('access_token', data.access_token)

            this.user.authenticated = true

            //redirect to specific route
            if(redirect)
                router.go(redirect)
        })
        .catch(error=>{
            context.error = error
        })
    },
    logout() {
        localStorage.removeItem('id_token')
        localStorage.removeItem('access_token')
        this.user.authenticated = false
    },
    checkAuth() {
        let jwt = localStorage.getItem('id_token')
        this.user.authenticated = jwt ? true : false
    },
    getAuthHeader() {
        return {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }
}
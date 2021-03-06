import axios from 'axios'
import {getErrorObject} from '../utils/errors'

const debug = require('debug')('API')

const BASE_URL = 'http://localhost:3000'

const API_URL = BASE_URL

//Error resonse wrapper
export class ApiError extends Error{
    constructor(data) {
        debug('ApiError', data)
        if(!data || typeof data!=='object')
            data = {}
        if(!data.msg)
            data.msg = 'Unknow error'

        data.code |=0
        if(!data.code)
            data.code = -1
        debug('ApiError before super')
        super(data.msg)
        this.name = this.constructor.name
        this.code = data.code|0
        this.data = data

    }

}

//Axios instance
const request = axios.create({
    baseURL:API_URL,
    timeout:10000,
    headers:{
       
    }
})

//Intercept request start
//Used for logging and authorization injection
request.interceptors.request.use(config => {
    if(config.token) {
        config.headers.authorization = `${config.token}`
    }
    debug('request-start', config.url, config, config.token)
    return config
})

//Handle the same way all responses status
request.interceptors.response.use(
    response => handleResponse(null, response),
    err => handleResponse(err, err.response)
)

/**
 * Response handler
 * @param  {Error} err      
 * @param  {Object} AJAX response 
 * @return {Promise}
 */
function handleResponse(err, response) {
    //Posible network or config errors
    if(!response)
        response = {}

    if(!response.data) {
        response.data = {
            status:false,
            error: {
                code:-2,
                msg: err && err.message
            }
        }
    }

    if(response.data==='Unauthorized') {
        debug('Unauthorized')
        response.data = {
            status:false,
            error: {
                code:response.status,
                msg: 'Usuario o contraseña incorrecta'
            }
        }
    }

    

    //KO response
    if(!response.data || response.data.status !== true) {
        let errorData = response.data && response.data.error
        debug('response-error', errorData)
        Object.assign(errorData, getErrorObject(errorData.code))
        debug('response-error handle', errorData)


        return Promise.reject(new ApiError(errorData))
    }

    //OK Response
    debug('response-ok', response.data)
    return response.data.data
}

/* UNLOGGED END POINTS */

export function authenticate(email, password) {
    return request.post('/login', {email, password})
}


export function register(username,email,password,firstName,lastName) {
    return request.post('/register', {username,email,password,firstName,lastName})
}

export function recoverPass(email) {
    return request.post('/recover', {email})
}

export function confirmEmail(token) {
    return request.post('/confirmEmail', {token})
}




/* AUTH END POINTS */

export function updateProfile(username,firstName, lastName, token) {
    debug('FN',firstName, 'LN', lastName)
    return request({
        url:'api/updateProfile',
        method: 'POST',
        token,
        data: {
            username,
            firstName,
            lastName
        }
    })
}



export function changePassword(password,newPassword, confirmNewPassword, token) {
    debug('pass',password, 'new pass', newPassword)
    return request({
        url:'api/changePassword',
        method: 'POST',
        token,
        data: {
            password,
            newPassword,
            confirmNewPassword
        }
    })
}

export function SendConfirmationEmail(token) {
    return request({
        url:'api/sendConfirmationEmail',
        method: 'GET',
        token
    })
}


export function getUser(token) {
    debug('request Token', token)
    return request({
        url:'/api/users/?onlySelf=true',
        token
    })
}

export function getGames(token, gameId) {
    debug('gameId', gameId)
    let query = gameId ? '?game=' + gameId : ''
    return request({
        url:'/api/games'+query,
        token
    })
}

export function setPlayer(gameId,position,token,socketId) {
    debug('request Token', token)
    return request({
        url:'/api/setPlayer',
        method: 'POST',
        token,
        data: {
            gameId,
            position,
            socketId
        }
    })
}
export function setSocketId(token,gameId,socketId) {
    debug('request Token', token)
    return request({
        url:'/api/setSocketId',
        method: 'POST',
        token,
        data: {
            gameId,
            socketId
        }
    })
}

export function setExtraPoints(token,gameId,extraPoint) {
    debug('request Token', extraPoint)
    return request({
        url:'/api/setExtraPoints',
        method: 'POST',
        token,
        data: {
            gameId,
            extraPoint
        }
    })
}



export function setReady(token,gameId) {
    debug('request Token', token)
    return request({
        url:'/api/setReady',
        method: 'POST',
        token,
        data: {
            gameId
        }
    })
}

export function pushCard(token, gameId, card) {
    debug('gameId', gameId)
    return request({
        url:'/api/pushCard',
        method: 'POST',
        token,
        data: {
            gameId,
            card
        }
    })
}

/* ADMIN END POINTS */

export function getUsers(token) {
    debug('request Token', token)

    return request({
        url:'/api/users',
        token
    })
        
}

export function createGame(type, token) {
    return request({
        url:'api/createGame',
        method: 'POST',
        token,
        data: {
            type
        }
    })
}

export function deleteGame(gameId, token) {
    return request({
        url:'api/deleteGame',
        method: 'POST',
        token,
        data: {
            gameId
        }
    })
}
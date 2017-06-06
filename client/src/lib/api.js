import axios from 'axios'

const debug = require('debug')('API')

const BASE_URL = 'http://localhost:3000'

const API_URL = BASE_URL

//Error resonse wrapper
export class ApiError extends Error{
    constructor(data) {
        if(!data || typeof data!=='object')
            data = {}
        if(!data.msg)
            data.msg = 'Unknow error'

        data.code |=0
        if(!data.code)
            data.code = -1

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
        return Promise.reject(new ApiError(errorData))
    }

    //OK Response
    debug('response-ok', response.data)
    return response.data.data
}

export function authenticate(email, password) {
    return request.post('/login', {email, password})
}

export function register(email,password,firstName,lastName) {
    return request.post('/register', {email,password,firstName,lastName})
}

export function getUsers(token) {
    debug('request Token', token)

    return request({
        url:'/api/users',
        token
    })
        
}
const errorsObject = {
    '2006': {
        'fields': ['email'],
        'message': 'EMAIL ALREADY IN USE'
    },
    '2001': {
        'fields': ['email', 'password'],
        'message': 'WRONG EMAIL OR PASSWORD'
    },
    'generic': {
        'message': 'GENERIC ERROR'
    }
}

const debug = require('debug')('ERRORS => ')

export function getErrorObject(code,fallback='generic'){
    debug('Code', code)
    debug('Object', errorsObject[code])
    return (
        errorsObject[code && code.toString()] || 
        errorsObject[fallback && fallback.toString()]
    )
}
const errorsObject = {
    '2006': {
        'fields': ['email'],
        'message': 'EMAIL ALREADY IN USE'
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

// export default class Errors {

//     getErrorObject(code,fallback='generic'){
//         debug('Code', code)
//         debug('Object', errorsObject[code])
//         return true
//         // return (
//         //     errorsObject[code && code.toString()] || 
//         //     errorsObject[fallback && fallback.toString()]
//         // )
//     }
    
// }
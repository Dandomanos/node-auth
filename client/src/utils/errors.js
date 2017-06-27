const errorsObject = {
    '2006': {
        'fields': ['email'],
        'message': 'EMAIL ALREADY IN USE'
    },
    '2001': {
        'fields': ['email', 'password'],
        'message': 'WRONG EMAIL OR PASSWORD'
    },
    '2007': {
        'fields': ['username'],
        'message': 'USERNAME ALREADY IN USE'
    },
    '2009': {
        'fields': ['password'],
        'message': 'INCORRECT PASSWORD'
    },
    "EMAIL_INVALID": {
        data:{
            code: 2020,
            message: 'Insert a valid email',
            fields:['email']
        }
    },
    "FIRSTNAME_INVALID": {
        data:{
            code: 2021,
            message: "Your Firstname can't contains numbers and special letters",
            fields:['firstName']
        }
    },
    "LASTNAME_INVALID": {
        data:{
            code: 2022,
            message: "Your Lastname can't contains numbers and special letters",
            fields:['lastName']
        }
    },
    "PASSWORD_INVALID": {
        data:{
            code: 2023,
            message: "Your Password must contains minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
            fields:['password']
        }
    },
    "PASSWORD_NOT_MATCH": {
        data:{
            code: 2024,
            message: "Your passwords do not match",
            fields:['password','confirmPassword']
        }
    },
    "NEW_PASSWORD_INVALID": {
        data:{
            code: 2025,
            message: "Your New Password must contains minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
            fields:['newPassword']
        }
    },
    "NEW_PASSWORD_NOT_MATCH": {
        data:{
            code: 2026,
            message: "Your new passwords do not match",
            fields:['newPassword','confirmNewPassword']
        }
    },
    'generic': {
        'message': 'UPS SOMETHING FAILED'
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
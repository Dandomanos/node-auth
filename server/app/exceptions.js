'use strict'

const {exception} = require('express-deliver')

exception.define({
    name:'ENOENT',
    code:2000,
    message:'No such file or directory',
    conversion: err=>err.code=='ENOENT'
})

exception.define({
    name:'ENOTDIR',
    code:2001,
    message:'Not a directory',
    conversion: err=>err.code=='ENOTDIR'
})

exception.define({
    name:'EBUSY',
    code:2002,
    message:'Resource busy or locked',
    conversion: err=>err.code=='EBUSY'
})

exception.define({
    name:'EPERM',
    code:2003,
    message:'Operation not permitted',
    conversion: err=>err.code=='EPERM'
})

exception.define({
    name:'InvalidPath',
    code:2004,
    message:'Invalid resource path',
    conversion: err=>err.message=='path must be a string or Buffer'
})

exception.define({
    name:'CannotParseJSON',
    code:2005,
    message:'Cannot parse JSON',
    conversion: err=>err.name=='SyntaxError' && err.message.indexOf('Unexpected token')===0
})

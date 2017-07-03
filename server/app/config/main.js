module.exports = {
    // Secret key for JWT signing and encryption
    'secret': 'super secret passphrase',
    // Database connection information
    'database': 'mongodb://localhost:27017/authTest',
    // Setting port for server
    'port': process.env.PORT || 3000,
    'domain': 'http://localhost',
    'clientDomain': 'http://localhost:8080',
    'userEmail': {
        'user': 'infocelmmessenger@gmail.com',
        'pass': 'Man12125'
    }
}
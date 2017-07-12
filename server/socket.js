const io = require('socket.io')
class socket {

    constructor(app) {
        this.io = io.listen(app)
    }

}

module.exports = socket
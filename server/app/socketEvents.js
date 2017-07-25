const debug = require('debug')('socketEvents')
let ioClient
module.exports = {
  initEvents() {
    ioClient.on('connection', (socket) => {
      debug('a user connected', socket.id)

      socket.on('updated', (games) => {
        debug('games updated')
        ioClient.sockets.in(games).emit('updated', games)
      })

      socket.emit('getid', socket.id)

      // // On conversation entry, join broadcast channel
      // socket.on('enter conversation', (conversation) => {
      //   socket.join(conversation);
      //   // debug('joined ' + conversation);
      // });

      // socket.on('leave conversation', (conversation) => {
      //   socket.leave(conversation);
      //   // debug('left ' + conversation);
      // })

      // socket.on('new message', (conversation) => {
      //   io.sockets.in(conversation).emit('refresh messages', conversation);
      //   });

      socket.on('disconnect', () => {
        debug('user disconnected', socket.id)
      })
    })
  },
  set(io){
    ioClient = io
  },
  get(){
    return ioClient
  }
}